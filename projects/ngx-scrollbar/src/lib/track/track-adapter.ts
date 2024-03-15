import { ContentChild, Directive, effect, EffectCleanupRegisterFn } from '@angular/core';
import {
  Observable,
  Subscription,
  BehaviorSubject,
  merge,
  fromEvent,
  tap,
  map,
  delay,
  switchMap,
  finalize,
  takeWhile,
  takeUntil,
  distinctUntilChanged,
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
  private scrollDirection: 'forward' | 'backward';

  // The maximum scroll position until the end is reached
  protected scrollMax: number;

  // The CSS variable name used to set the length value
  protected abstract readonly cssLengthProperty: string;

  protected abstract get viewportScrollSize(): number;

  protected abstract get viewportSize(): number;

  // Get track client rect
  protected get clientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  // Scrollbar track length
  abstract get size(): number;

  // Scrollbar track offset
  abstract get offset(): number;

  protected abstract scrollTo(position: number): Observable<void>;

  protected abstract getScrollDirection(position: number): 'forward' | 'backward';

  // Reference to the ThumbAdapter component
  @ContentChild(ThumbAdapter) protected thumb: ThumbAdapter;

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

    // The reason why we use mousemove instead of mouseover, that we need to save the current mouse location
    const pointerMove$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointermove', { passive: true }).pipe(
      map((e: PointerEvent) => {
        this.currMousePosition = e[this.control.clientProperty];
        return true;
      })
    );

    const pointerOut$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointerout', { passive: true }).pipe(
      map(() => false)
    );

    // Behavior subject to track mouse position over the track
    const pointerOverTrack$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    return pointerDown$.pipe(
      switchMap((startEvent: PointerEvent) => {
        // We need to subscribe to mousemove and mouseout events before calling the onTrackFirstClick
        // Because we need to tell if mouse is over or not asap after the first function is done
        // Otherwise, if user click first time and moved the mouse away immediately, the mouseout will not be detected
        merge(pointerMove$, pointerOut$).pipe(
          distinctUntilChanged(),
          tap((over: boolean) => pointerOverTrack$.next(over)),
          takeUntil(pointerUp$)
        ).subscribe();

        // Stop propagating the move event when pointer is moving over the thumb
        fromEvent(this.thumb.nativeElement, 'pointermove').pipe(
          stopPropagation(),
          takeUntil(pointerUp$)
        ).subscribe();

        return this.onTrackFirstClick(startEvent).pipe(
          delay(200),
          switchMap(() => {
            // Otherwise, activate pointermove and pointerout events and switch to ongoing scroll calls
            return pointerOverTrack$.pipe(
              switchMap((over: boolean) => {
                const currDirection: 'forward' | 'backward' = this.getScrollDirection(this.currMousePosition);
                const sameDirection: boolean = this.scrollDirection === currDirection;
                // If mouse is out the track pause the scroll calls, otherwise keep going
                return (over && sameDirection) ? this.onTrackOngoingMousedown() : EMPTY;
              }),
              finalize(() => {
                // Reset the mouseOverTrack$ state
                pointerOverTrack$.next(true);
              })
            ) as Observable<PointerEvent>;
          }),
          takeUntil(pointerUp$),
        );
      })
    );
  }

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

  protected abstract getScrollForwardIncrement(): number;

  protected abstract getScrollBackwardIncrement(): number;

  protected abstract getOnGoingScrollForward(): { position: number, nextPosition: number, endPosition: number };

  protected abstract getOnGoingScrollBackward(): { position: number, nextPosition: number, endPosition: number };

  private update(): void {
    this.cmp.nativeElement.style.setProperty(this.cssLengthProperty, `${ this.size }`);
  }

  /**
   *  Callback when mouse is first clicked on the track
   */
  onTrackFirstClick(e: PointerEvent): Observable<void> {
    // Initialize variables and determine scroll direction
    this.currMousePosition = e[this.control.clientProperty];
    this.scrollDirection = this.getScrollDirection(this.currMousePosition);
    this.scrollMax = this.control.viewportScrollMax;

    // Calculate scroll position and trigger scroll
    let value: number;

    // Check which direction should the scroll go (forward or backward)
    if (this.scrollDirection === 'forward') {
      // Scroll forward
      const scrollForwardIncrement: number = this.getScrollForwardIncrement();

      // Check if the incremental position is bigger than the scroll max
      if (scrollForwardIncrement >= this.scrollMax) {
        value = this.scrollMax;
      } else {
        value = scrollForwardIncrement;
      }
    } else {
      // Scroll backward
      const scrollBackwardIncrement: number = this.getScrollBackwardIncrement();

      if (scrollBackwardIncrement <= 0) {
        value = 0;
      } else {
        value = scrollBackwardIncrement;
      }
    }

    return this.scrollTo(value);
  }

  /**
   * Callback when mouse is still down on the track
   * Incrementally scrolls towards target position until reached
   */
  onTrackOngoingMousedown(): Observable<boolean> {
    // Calculate scroll increments and trigger ongoing scroll
    let position: number;
    let nextPosition: number;
    let endPosition: number;

    // Check which direction should the scroll go (forward or backward)
    if (this.scrollDirection === 'forward') {
      // Scroll forward
      ({ position, nextPosition, endPosition } = this.getOnGoingScrollForward());
    } else {
      // Scroll backward
      ({ position, nextPosition, endPosition } = this.getOnGoingScrollBackward());
    }
    const isFinalStep: boolean = this.isFinalStep(position);

    return this.scrollTo(isFinalStep ? endPosition : nextPosition).pipe(
      takeWhile(() => !isFinalStep),
      switchMap(() => this.onTrackOngoingMousedown())
    );
  }

  /**
   *  Returns the normalized position whether it's forward or backward for both LTR or RTL directions
   */
  private getCurrPosition(position: number): number {
    if (this.scrollDirection === 'forward') {
      return Math.abs(position);
    } else {
      return Math.abs(position + this.thumb.size - this.viewportScrollSize);
    }
  }

  /**
   * Returns a flag that determines whether the scroll from the given position is the final step or not
   */
  private isFinalStep(position: number): boolean {
    // Calculate the length from the input position to the end of the scroll
    const lengthFromInputToEnd: number = this.viewportScrollSize - this.thumb.size - this.getCurrPosition(position);
    // Calculate the number of viewport sizes contained from the current position to the end of the scroll
    const numberOfViewportSizes: number = Math.floor(lengthFromInputToEnd / this.viewportSize);
    return numberOfViewportSizes === 0;
  }
}
