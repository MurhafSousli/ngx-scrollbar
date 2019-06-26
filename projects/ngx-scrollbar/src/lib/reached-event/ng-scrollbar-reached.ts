import { Directive, Optional, Input, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subject, Subscription, Observer } from 'rxjs';
import { filter, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';

class ScrollReached implements OnDestroy {

  /** offset: Reached offset value in px */
  @Input('reachedOffset') offset = 0;

  /**
   * scrollEvent: is a stream that emits scroll event when `elementScrolled()` is ready.
   * NOTE: I used this method because the scroll event must be initialized before the reached outputs,
   * but `elementScrolled()` returns undefined if called before the view is initialized.
   */
  protected scrollEvent = new Subject<any>();

  protected subscription = Subscription.EMPTY;

  protected reachedEvent = new Observable((observer: Observer<any>) =>
    this.scrollReached().subscribe(_ =>
      Promise.resolve().then(() => this.ngZone.run(() => observer.next(_)))));

  constructor(@Optional() protected scrollbar: NgScrollbar, protected ngZone: NgZone) {
    if (!scrollbar) {
      throw new Error('[NgScrollbarReached Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  protected isReached(offset: number, e?: any): boolean {
    return false;
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
}

class VerticalScrollReached extends ScrollReached implements OnInit {
  constructor(@Optional() protected scrollbar: NgScrollbar, protected ngZone: NgZone) {
    super(scrollbar, ngZone);
  }

  ngOnInit() {
    this.subscription = this.scrollbar.verticalScrolled.subscribe(this.scrollEvent);
  }
}

class HorizontalScrollReached extends ScrollReached implements OnInit {
  constructor(@Optional() protected scrollbar: NgScrollbar, protected ngZone: NgZone) {
    super(scrollbar, ngZone);
  }

  ngOnInit() {
    this.subscription = this.scrollbar.horizontalScrolled.subscribe(this.scrollEvent);
  }
}

@Directive({
  selector: '[reachedTop], [reached-top]',
})
export class NgScrollbarReachedTop extends VerticalScrollReached {
  @Output() reachedTop: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected ngZone: NgZone) {
    super(scrollbar, ngZone);
  }

  protected isReached(offset: number, e: any): boolean {
    const position = e.target.scrollTop;
    return position <= offset;
  }
}

@Directive({
  selector: '[reachedBottom], [reached-bottom]',
})
export class NgScrollbarReachedBottom extends VerticalScrollReached {

  @Output() reachedBottom: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected ngZone: NgZone) {
    super(scrollbar, ngZone);
  }

  protected isReached(offset: number, e: any): boolean {
    const position = e.target.scrollTop + e.target.clientHeight;
    const target = e.target.scrollHeight;
    return position >= target - offset;
  }
}

@Directive({
  selector: '[reachedLeft], [reached-left]',
})
export class NgScrollbarReachedLeft extends HorizontalScrollReached {

  @Output() reachedLeft: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected ngZone: NgZone) {
    super(scrollbar, ngZone);
  }

  protected isReached(offset: number, e: any): boolean {
    const position = e.target.scrollLeft;
    return position <= offset;
  }
}

@Directive({
  selector: '[reachedRight], [reached-right]',
})
export class NgScrollbarReachedRight extends HorizontalScrollReached {

  @Output() reachedRight: Observable<any> = this.reachedEvent;

  constructor(@Optional() protected scrollbar: NgScrollbar, protected ngZone: NgZone) {
    super(scrollbar, ngZone);
  }

  protected isReached(offset: number, e: any): boolean {
    const position = e.target.scrollLeft + e.target.clientWidth;
    const target = e.target.scrollWidth;
    return position >= target - offset;
  }
}
