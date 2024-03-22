import { ContentChild, Directive, effect, EffectCleanupRegisterFn } from '@angular/core';
import {
  Observable,
  Subscription,
  tap,
  map,
  delay,
  merge,
  startWith,
  switchMap,
  fromEvent,
  takeUntil,
  takeWhile,
  EMPTY
} from 'rxjs';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { ThumbAdapter } from '../thumb/thumb-adapter';
import { resizeObserver } from '../viewport';
import { PointerEventsAdapter } from '../utils/pointer-events-adapter';

@Directive()
export abstract class TrackAdapter extends PointerEventsAdapter {

  // Subscription for resize observer
  private sizeChangeSub: Subscription;

  // The current position of the mouse during track dragging
  private currMousePosition: number;

  // The direction of scroll when the track area is clicked
  protected scrollDirection: 'forward' | 'backward';

  // The maximum scroll position until the end is reached
  protected scrollMax: number;

  // The CSS variable name used to set the length value
  protected abstract readonly cssLengthProperty: string;

  // Returns viewport scroll size
  protected abstract get viewportScrollSize(): number;

  // Returns viewport client size
  protected get viewportSize(): number {
    return this.cmp.viewport[this.control.sizeProperty];
  }

  // Get track client rect
  protected get clientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  // Returns the scroll position relative to the track
  protected abstract getCurrPosition(): number;

  // Returns the dragging direction forward or backward
  protected abstract getScrollDirection(position: number): 'forward' | 'backward';

  // Function that scrolls to the given position
  protected abstract scrollTo(position: number): Observable<void>;

  // Scrollbar track offset
  get offset(): number {
    return this.clientRect[this.control.clientRectProperty];
  }

  // Scrollbar track length
  get size(): number {
    return this.nativeElement[this.control.sizeProperty];
  }

  // Observable for track dragging events
  get pointerEvents(): Observable<PointerEvent> {
    // Observable streams for pointer events
    const pointerDown$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerdown').pipe(
      stopPropagation(),
      preventSelection(this.document)
    );
    const pointerUp$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { passive: true }).pipe(
      enableSelection(this.document)
    );

    const pointerEnter$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointerover', { passive: true }).pipe(
      // When mouse is out and enters again, must set the current position first
      tap((e: PointerEvent) => this.currMousePosition = e[this.control.offsetProperty]),
      map(() => true)
    );
    const pointerLeave$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointerout', { passive: true }).pipe(
      map(() => false)
    );

    const pointerOver$: Observable<boolean> = merge(pointerEnter$, pointerLeave$).pipe(startWith(true));

    // Keep track of current mouse location while dragging
    const pointerMove$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointermove', { passive: true }).pipe(
      tap((e: PointerEvent) => this.currMousePosition = e[this.control.offsetProperty])
    );

    return pointerDown$.pipe(
      switchMap((startEvent: PointerEvent) => {
        // Track pointer location while dragging
        pointerMove$.pipe(takeUntil(pointerUp$)).subscribe();

        return this.onTrackFirstClick(startEvent).pipe(
          delay(200),
          switchMap(() => {
            // Otherwise, activate pointermove and pointerout events and switch to ongoing scroll calls
            return pointerOver$.pipe(
              switchMap((over: boolean) => {
                const currDirection: 'forward' | 'backward' = this.getScrollDirection(this.currMousePosition);
                const sameDirection: boolean = this.scrollDirection === currDirection;
                // If mouse is out the track pause the scroll calls, otherwise keep going
                return (over && sameDirection) ? this.onTrackOngoingMousedown() : EMPTY;
              }),
            ) as Observable<PointerEvent>;
          }),
          takeUntil(pointerUp$),
        );
      })
    );
  }

  // Reference to the ThumbAdapter component
  @ContentChild(ThumbAdapter) protected thumb: ThumbAdapter;

  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      if (this.cmp.disableSensor()) {
        this.update();
        this.sizeChangeSub?.unsubscribe();
      } else {
        this.zone.runOutsideAngular(() => {
          // Update styles with real track size
          this.sizeChangeSub = resizeObserver({
            element: this.nativeElement,
            throttleDuration: this.cmp.sensorThrottleTime()
          }).pipe(
            tap(() => this.update())
          ).subscribe();
        });
      }

      onCleanup(() => this.sizeChangeSub?.unsubscribe());
    });
    super();
  }

  protected abstract getScrollForwardStep(): number;

  protected abstract getScrollBackwardStep(): number;

  private update(): void {
    this.cmp.nativeElement.style.setProperty(this.cssLengthProperty, `${ this.size }`);
  }

  /**
   *  Callback when mouse is first clicked on the track
   */
  onTrackFirstClick(e: PointerEvent): Observable<void> {
    // Initialize variables and determine scroll direction
    this.currMousePosition = e[this.control.offsetProperty];
    this.scrollDirection = this.getScrollDirection(this.currMousePosition);
    this.scrollMax = this.control.viewportScrollMax;
    return this.scrollTo(this.nextStep());
  }

  private nextStep(): number {
    // Check which direction should the scroll go (forward or backward)
    if (this.scrollDirection === 'forward') {
      // Scroll forward
      const scrollForwardIncrement: number = this.getScrollForwardStep();

      // Check if the incremental position is bigger than the scroll max
      if (scrollForwardIncrement >= this.scrollMax) {
        return this.scrollMax;
      }
      return scrollForwardIncrement;
    }
    // Scroll backward
    const scrollBackwardIncrement: number = this.getScrollBackwardStep();

    if (scrollBackwardIncrement <= 0) {
      return 0;
    }
    return scrollBackwardIncrement;
  }

  /**
   * Callback when mouse is still down on the track
   * Incrementally scrolls towards target position until reached
   */
  onTrackOngoingMousedown(): Observable<unknown> {
    const position: number = this.nextStep();
    return this.scrollTo(position).pipe(
      takeWhile(() => !this.isReached(position)),
      switchMap(() => this.onTrackOngoingMousedown())
    );
  }

  /**
   * Returns a flag that determines whether the scroll from the given position is the final step or not
   */
  private isReached(position: number): boolean {
    if (this.scrollDirection === 'forward') {
      return position >= this.scrollMax;
    }
    return position <= 0;
  }
}
