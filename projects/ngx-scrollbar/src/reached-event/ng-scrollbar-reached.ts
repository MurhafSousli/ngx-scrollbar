import { Directive, NgZone, Optional, Input, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { filter, map, tap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { pipeFromArray } from 'rxjs/internal/util/pipe';

import { NgScrollbarReachedChecker, NgScrollbarReachedPoint } from './ng-scrollbar-reached-config';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';

@Directive({
  selector: '[reachedTop], [reachedLeft], [reachedRight], [reachedBottom]',
})
export class NgScrollbarReached implements AfterViewInit, OnDestroy {

  /**
   * scrollEvent: is a stream that emits scroll event when `elementScrolled()` is ready.
   * NOTE: I used this method because the scroll event must be initialized before the reached outputs,
   * but `elementScrolled()` returns undefined if called before the view is initialized.
   */
  private verticalScrollEvent = new Subject<any>();
  private horizontalScrollEvent = new Subject<any>();

  /** Scroll event unsubscriber */
  private unsubscriber = new Subject();

  /**
   * offset: Reached offset value in px
   */
  @Input('ngScrollbarOffset') offset = 0;

  @Output() reachedTop: Observable<any> =
    new Observable((observer: Observer<any>) =>
      this.reached('top').subscribe(_ =>
        Promise.resolve().then(() => this.ngZone.run(() => observer.next(_)))));

  @Output() reachedLeft: Observable<any> =
    new Observable((observer: Observer<any>) =>
      this.reached('left').subscribe(_ =>
        Promise.resolve().then(() => this.ngZone.run(() => observer.next(_)))));

  @Output() reachedRight: Observable<any> =
    new Observable((observer: Observer<any>) =>
      this.reached('right').subscribe(_ =>
        Promise.resolve().then(() => this.ngZone.run(() => observer.next(_)))));

  @Output() reachedBottom: Observable<any> =
    new Observable((observer: Observer<any>) =>
      this.reached('bottom').subscribe(_ =>
        Promise.resolve().then(() => this.ngZone.run(() => observer.next(_)))));

  constructor(
    @Optional() protected scrollbar: NgScrollbar,
    protected checker: NgScrollbarReachedChecker,
    protected ngZone: NgZone
  ) {
    if (!scrollbar) {
      throw new Error('[NgScrollbarReached Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterViewInit() {
    this.scrollbar.verticalScrollEvent.pipe(
      takeUntil(this.unsubscriber),
      tap((e: any) => this.verticalScrollEvent.next(e))
    ).subscribe();

    this.scrollbar.horizontalScrollEvent.pipe(
      takeUntil(this.unsubscriber),
      tap((e: any) => this.horizontalScrollEvent.next(e))
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  /**
   *
   * @param eventName: Name of event 'top', 'left', 'bottom', 'right'
   */
  reached(eventName: NgScrollbarReachedPoint): Observable<any> {
    // current event
    let currEvent: any;

    // Get the proper reached function which checks if the scroll event has reached the target
    const isReached = this.checker.getReachedCheckerFunc(eventName);

    // Currently, 'pipeFromArray' is used to make it possible to pass an operator in a variable
    return pipeFromArray([
      tap((e) => currEvent = e),
      // Check if it scroll has reached
      isReached(this.offset),
      // Emit only if reached state has changed
      distinctUntilChanged(),
      // Emit only if it scroll has reached
      filter((reached: boolean) => reached),
      // Return scroll event
      map(() => currEvent)
    ])(eventName === 'top' || eventName === 'bottom' ? this.verticalScrollEvent : this.horizontalScrollEvent);
  }

}

/**
 *
 // const reachedStream = this.scrollEvent.pipe(
 //   map((event: any) => {
    //     currEvent = event;
    //     // Get the proper checker function 'top', 'left', 'bottom', 'right'
    //     const reachedChecker = this.checker.getReachedCheckerFunc(eventName);
    //     // Return reached value
    //     return reachedChecker(event.target, this.offset);
    //   }),
 //   // Emit only if reached value has changed
 //   distinctUntilChanged()
 // );
 */

/**
 *  The following code work perfectly to return the reached event.
 *  However, because 'offset' input is introduced, the scroll event may skip emitting for every pixel depends on user scroll speed.
 *  Therefore, we needed to use '>=' condition to check if element scrollTop has reached the target
 *  And emit again only if reached value has changed
 *
 interface ReachedState {
    reached: boolean;
    event: any;
  }

 return this.scrollEvent.pipe(
 map((event: any) => {
      const reachedChecker = this.checker.getPointChecker(point);
      const reached = reachedChecker(event.target, this.offset);
      return {reached, event}
    }),
 filter((state: ReachedState) => state.reached),
 map((state) => state.event)
 );
 */
