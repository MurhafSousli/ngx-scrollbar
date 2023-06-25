import { Directive, Optional, Input, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { RtlScrollAxisType } from '@angular/cdk/platform';
import { NgScrollbar } from 'ngx-scrollbar';
import { Observable, Subject, Subscription, Subscriber, filter, map, tap, distinctUntilChanged } from 'rxjs';

// Fix target type on ElementEvent
type ElementEvent = Event & { target: Element };

class ReachedFunctions {
  static reachedTop(offset: number, e: ElementEvent): boolean {
    return ReachedFunctions.reached(-e.target.scrollTop, 0, offset);
  }

  static reachedBottom(offset: number, e: ElementEvent): boolean {
    return ReachedFunctions.reached(e.target.scrollTop + e.target.clientHeight, e.target.scrollHeight, offset);
  }

  static reachedStart(offset: number, e: ElementEvent, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
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

  static reachedEnd(offset: number, e: ElementEvent, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
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
  @Input('reachedOffset') offset: number = 0;

  /**
   * Stream that emits scroll event when `NgScrollbar.scrolled` is initialized.
   *
   * **NOTE:** This subject is used to hold the place of `NgScrollbar.scrolled` when it's not initialized yet
   */
  protected scrollEvent = new Subject<ElementEvent>();

  /** subscription: Scrolled event subscription, used to unsubscribe from the event on destroy */
  protected subscription = Subscription.EMPTY;

  /** A stream used to assign the reached output */
  protected reachedEvent = new Observable((subscriber: Subscriber<ElementEvent>) =>
    this.scrollReached().subscribe(_ =>
      Promise.resolve().then(() => this.zone.run(() => subscriber.next(_)))));

  protected constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    if (!scrollbar) {
      console.warn('[NgScrollbarReached Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  protected scrollReached(): Observable<ElementEvent> {
    // current event
    let currEvent: ElementEvent;

    return this.scrollEvent.pipe(
      tap((e: ElementEvent) => currEvent = e),
      // Check if scroll has reached
      map((e: ElementEvent) => this.reached(this.offset, e)),
      // Distinct until reached value has changed
      distinctUntilChanged(),
      // Emit only if reached is true
      filter((reached: boolean) => reached),
      // Return scroll event
      map(() => currEvent)
    );
  }

  protected abstract reached(offset: number, e?: ElementEvent): boolean;
}

@Directive()
abstract class VerticalScrollReached extends ScrollReached implements OnInit {
  protected constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // Fix the viewport size in case the rendered size is not rounded
      const fixedSize: number = Math.round(this.scrollbar.viewport.nativeElement.getBoundingClientRect().height);
      this.scrollbar.viewport.nativeElement.style.height = `${ fixedSize }px`;

      this.subscription = this.scrollbar.verticalScrolled!.subscribe(this.scrollEvent);
    });
  }
}

@Directive()
abstract class HorizontalScrollReached extends ScrollReached implements OnInit {
  protected constructor(@Optional() protected scrollbar: NgScrollbar, protected zone: NgZone) {
    super(scrollbar, zone);
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // Fix the viewport size in case the rendered size is not rounded
      const fixedSize: number = Math.round(this.scrollbar.viewport.nativeElement.getBoundingClientRect().width);
      this.scrollbar.viewport.nativeElement.style.width = `${ fixedSize }px`;

      this.subscription = this.scrollbar.horizontalScrolled!.subscribe(this.scrollEvent);
    });
  }
}

@Directive({
  selector: '[reachedTop], [reached-top]',
  standalone: true,
})
export class NgScrollbarReachedTop extends VerticalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the top */
  @Output() reachedTop: Observable<ElementEvent> = this.reachedEvent;

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
  protected reached(offset: number, e: ElementEvent): boolean {
    return ReachedFunctions.reachedTop(offset, e);
  }
}

@Directive({
  selector: '[reachedBottom], [reached-bottom]',
  standalone: true,
})
export class NgScrollbarReachedBottom extends VerticalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the bottom */
  @Output() reachedBottom: Observable<ElementEvent> = this.reachedEvent;

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
  protected reached(offset: number, e: ElementEvent): boolean {
    return ReachedFunctions.reachedBottom(offset, e);
  }
}

@Directive({
  selector: '[reachedStart], [reached-start]',
  standalone: true,
})
export class NgScrollbarReachedStart extends HorizontalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the start */
  @Output() reachedStart: Observable<ElementEvent> = this.reachedEvent;

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
  protected reached(offset: number, e: ElementEvent): boolean {
    return ReachedFunctions.reachedStart(offset, e, this.dir.value, this.scrollbar.manager.rtlScrollAxisType);
  }
}

@Directive({
  selector: '[reachedEnd], [reached-end]',
  standalone: true,
})
export class NgScrollbarReachedEnd extends HorizontalScrollReached implements OnInit {

  /** Stream that emits when scroll has reached the end */
  @Output() reachedEnd: Observable<ElementEvent> = this.reachedEvent;

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
  protected reached(offset: number, e: ElementEvent): boolean {
    return ReachedFunctions.reachedEnd(offset, e, this.dir.value, this.scrollbar.manager.rtlScrollAxisType);
  }
}
