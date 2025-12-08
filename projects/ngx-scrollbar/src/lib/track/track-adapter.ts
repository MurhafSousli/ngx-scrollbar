import { Directive } from '@angular/core';
import {
  Observable,
  tap,
  delay,
  filter,
  fromEvent,
  startWith,
  switchMap,
  takeUntil,
  takeWhile
} from 'rxjs';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { PointerEventsAdapter } from '../utils/pointer-events-adapter';

@Directive()
export abstract class TrackAdapter extends PointerEventsAdapter {

  private pointerOut$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerout', { passive: true });

  // The current position of the mouse during track dragging
  private currMousePosition: number;

  // The direction of scroll when the track area is clicked
  protected scrollDirection: 'forward' | 'backward';

  // The maximum scroll position until the end is reached
  protected scrollMax: number;

  // Returns viewport scroll size
  protected abstract get contentSize(): number;

  // Returns viewport client size
  protected get viewportSize(): number {
    return this.adapter[this.control.sizeProperty];
  }

  // Get track client rect
  protected get clientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  // Scrollbar track offset
  get offset(): number {
    return this.clientRect[this.control.rectOffsetProperty];
  }

  // Scrollbar track length
  get size(): number {
    // Noticed that clientHeight is evaluated before getClientRect.height,
    // causing a wrong track size when integrated in dropdown integration
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

    const pointerOver$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerover', { passive: true }).pipe(
      // When the mouse is out and enters again, must set the current position first
      tap((e: PointerEvent) => this.currMousePosition = this.getPointerPosition(e)),
      startWith({} as PointerEvent),
    );

    // Keep track of the current mouse location while dragging
    const pointerMove$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointermove', { passive: true }).pipe(
      tap((e: PointerEvent) => this.currMousePosition = this.getPointerPosition(e))
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
              filter(() => this.scrollDirection === this.getScrollDirection(this.currMousePosition)),
              switchMap(() => this.onTrackOngoingMousedown())
            ) as Observable<PointerEvent>;
          }),
          takeUntil(pointerUp$),
        );
      })
    );
  }

  constructor() {
    super();
  }

  // Returns the dragging direction forward or backward
  abstract getScrollDirection(position: number): 'forward' | 'backward';

  // Function that scrolls to the given position
  protected abstract scrollTo(position: number): Observable<void>;

  protected abstract getScrollForwardStep(): number;

  protected abstract getScrollBackwardStep(): number;

  protected abstract getThumbStartPosition(): number;

  protected abstract getThumbEndPosition(): number;

  private getPointerPosition(e: PointerEvent): number {
    return e[this.control.clientProperty] - this.offset;
  }

  /**
   *  Callback when mouse is first clicked on the track
   */
  onTrackFirstClick(e: PointerEvent): Observable<void> {
    // Initialize variables and determine scroll direction
    this.currMousePosition = this.getPointerPosition(e);
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
      // If mouse left the track, terminate the stream
      takeUntil(this.pointerOut$),
      // Keep scrolling until target position is reached
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
