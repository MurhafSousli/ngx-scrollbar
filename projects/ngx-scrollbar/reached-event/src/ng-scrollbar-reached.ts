import { Directive, Optional, Input, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { Observable, Subject, Subscription, Observer } from 'rxjs';
import { filter, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
// Uncomment the following line in development mode
// import { NgScrollbar } from '../../src/public-api';

class ReachedFunctions {
  static isReachedTop(offset: number, e: any): boolean {
    const position = e.target.scrollTop;
    return position <= offset;
  }

  static isReachedBottom(offset: number, e: any): boolean {
    const position = e.target.scrollTop + e.target.clientHeight;
    const target = e.target.scrollHeight;
    return position >= target - offset;
  }

  static isReachedLeft(offset: number, e: any): boolean {
    const position = e.target.scrollLeft;
    return position <= offset;
  }

  static isReachedRight(offset: number, e: any): boolean {
    const position = e.target.scrollLeft + e.target.clientWidth;
    const target = e.target.scrollWidth;
    return position >= target - offset;
  }
}

abstract class ScrollReached implements OnDestroy {

  /** offset: Reached offset value in px */
  @Input('reachedOffset') offset = 0;

  /**
   * Stream that emits scroll event when `NgScrollbar.scrolled` is initialized.
   *
   * **NOTE:** This subject is used to hold the place of `NgScrollbar.scrolled` when it's not initialized yet
   */
  protected scrollEvent = new Subject<any>();

  /** subscription: Scrolled event subscription, used to unsubscribe from the event on destroy */
  protected subscription = Subscription.EMPTY;

  /** A stream used to assign the reached output */
  protected reachedEvent = new Observable((observer: Observer<any>) =>
    this.scrollReached().subscribe(_ =>
      Promise.resolve().then(() => this.zone.run(() => observer.next(_)))));

  protected constructor(protected scrollbar: NgScrollbar, protected zone: NgZone) {
    if (!scrollbar) {
      throw new Error('[NgScrollbarReached Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  protected scrollReached(): Observable<any> {
    // current event
    let currEvent: any;

    return this.scrollEvent.pipe(
      tap((e) => currEvent = e),
      // Check if it scroll has reached
      map((e) => this.isReached(this.offset, e)),
      // Distinct until reached value has changed
      distinctUntilChanged(),
      // Emit only if reached is true
      filter((reached: boolean) => reached),
      // Return scroll event
      map(() => currEvent)
    );
  }

  protected abstract isReached(offset: number, e?: any): boolean;
}

abstract class VerticalScrollReached extends ScrollReached implements OnInit {
  protected constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    this.subscription = this.scrollbar.verticalScrolled.subscribe(this.scrollEvent);
  }
}

abstract class HorizontalScrollReached extends ScrollReached implements OnInit {
  protected constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    this.subscription = this.scrollbar.horizontalScrolled.subscribe(this.scrollEvent);
  }
}

@Directive({
  selector: '[reachedTop], [reached-top]',
})
export class NgScrollbarReachedTop extends VerticalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the top */
  @Output() reachedTop: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Check if scroll has reached the top (vertically)
   * @param offset Scroll offset
   * @param e Scroll event
   */
  protected isReached(offset: number, e: any): boolean {
    return ReachedFunctions.isReachedTop(offset, e);
  }
}

@Directive({
  selector: '[reachedBottom], [reached-bottom]',
})
export class NgScrollbarReachedBottom extends VerticalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the bottom */
  @Output() reachedBottom: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Check if scroll has reached the bottom (vertically)
   * @param offset Scroll offset
   * @param e Scroll event
   */
  protected isReached(offset: number, e: any): boolean {
    return ReachedFunctions.isReachedBottom(offset, e);
  }
}

@Directive({
  selector: '[reachedStart], [reached-start]',
})
export class NgScrollbarReachedStart extends HorizontalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the start */
  @Output() reachedStart: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone, private dir: Directionality) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Check if scroll has reached the start (horizontally)
   * @param offset Scroll offset
   * @param e Scroll event
   */
  protected isReached(offset: number, e: any): boolean {
    return this.dir.value === 'ltr'
      ? ReachedFunctions.isReachedLeft(offset, e)
      : ReachedFunctions.isReachedRight(offset, e);
  }
}

@Directive({
  selector: '[reachedEnd], [reached-end]',
})
export class NgScrollbarReachedEnd extends HorizontalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the end */
  @Output() reachedEnd: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone, private dir: Directionality) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Check if scroll has reached the end (horizontally)
   * @param offset Scroll offset
   * @param e Scroll event
   */
  protected isReached(offset: number, e: any): boolean {
    return this.dir.value === 'ltr'
      ? ReachedFunctions.isReachedRight(offset, e)
      : ReachedFunctions.isReachedLeft(offset, e);
  }
}
