import { Directive, Optional, Input, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { RtlScrollAxisType } from '@angular/cdk/platform';
import { Observable, Subject, Subscription, Subscriber } from 'rxjs';
import { filter, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
// Uncomment the following line in development mode
// import { NgScrollbar } from '../../src/public-api';

class ReachedFunctions {
  static reachedTop(offset: number, e: any): boolean {
    return ReachedFunctions.reached(-e.target.scrollTop, 0, offset);
  }

  static reachedBottom(offset: number, e: any): boolean {
    return ReachedFunctions.reached(e.target.scrollTop + e.target.clientHeight, e.target.scrollHeight, offset);
  }

  static reachedStart(offset: number, e: any, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
    if (direction === 'rtl') {
      if (rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return ReachedFunctions.reached(e.target.scrollLeft, 0, offset);
      }
      if (rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return ReachedFunctions.reached(-e.target.scrollLeft, 0, offset);
      }
      return ReachedFunctions.reached(e.target.scrollLeft + e.target.clientWidth, e.target.scrollWidth, offset);
    }
    return ReachedFunctions.reached(-e.target.scrollLeft, 0, offset);
  }

  static reachedEnd(offset: number, e: any, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
    if (direction === 'rtl') {
      if (rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return ReachedFunctions.reached(-(e.target.scrollLeft - e.target.clientWidth), e.target.scrollWidth, offset);
      }
      if (rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return ReachedFunctions.reached(-(e.target.scrollLeft + e.target.clientWidth), e.target.scrollWidth, offset);
      }
      return ReachedFunctions.reached(-e.target.scrollLeft, 0, offset);
    }
    return ReachedFunctions.reached(e.target.scrollLeft + e.target.clientWidth, e.target.scrollWidth, offset);
  }

  static reached(currPosition: number, targetPosition: number, offset: number): boolean {
    return currPosition >= targetPosition - offset;
  }
}

@Directive()
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
  protected reachedEvent = new Observable((subscriber: Subscriber<any>) =>
    this.scrollReached().subscribe(_ =>
      Promise.resolve().then(() => this.zone.run(() => subscriber.next(_)))));

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
      map((e) => this.reached(this.offset, e)),
      // Distinct until reached value has changed
      distinctUntilChanged(),
      // Emit only if reached is true
      filter((reached: boolean) => reached),
      // Return scroll event
      map(() => currEvent)
    );
  }

  protected abstract reached(offset: number, e?: any): boolean;
}

@Directive()
abstract class VerticalScrollReached extends ScrollReached implements OnInit {
  protected constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    this.subscription = this.scrollbar.verticalScrolled.subscribe(this.scrollEvent);
  }
}

@Directive()
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
  protected reached(offset: number, e: any): boolean {
    return ReachedFunctions.reachedTop(offset, e);
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
  protected reached(offset: number, e: any): boolean {
    return ReachedFunctions.reachedBottom(offset, e);
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
  protected reached(offset: number, e: any): boolean {
    return ReachedFunctions.reachedStart(offset, e, this.dir.value, this.scrollbar.manager.rtlScrollAxisType);
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
  protected reached(offset: number, e: any): boolean {
    return ReachedFunctions.reachedEnd(offset, e, this.dir.value, this.scrollbar.manager.rtlScrollAxisType);
  }
}
