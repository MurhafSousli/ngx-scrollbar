import { ContentChild, Directive, inject, effect, ElementRef, EffectCleanupRegisterFn, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Observable,
  Subscription,
  BehaviorSubject,
  merge,
  fromEvent,
  tap,
  map,
  expand,
  delay,
  switchMap,
  finalize,
  takeWhile,
  takeUntil,
  distinctUntilChanged,
  EMPTY
} from 'rxjs';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { ThumbAdapter } from '../thumb/thumb-adapter';
import { resizeObserver } from '../viewport';


// @dynamic
@Directive()
export abstract class TrackAdapter {

  // The native element of the track directive
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  // Reference to the NgScrollbar component
  protected readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);

  // Reference to the document object
  private readonly document: Document = inject(DOCUMENT);

  // Reference to angular zone
  private readonly zone: NgZone = inject(NgZone);

  // Subscription for resize observer
  private sizeChangeSub: Subscription;

  // The current position of the mouse during track dragging
  private currMousePosition: number;

  // The direction of scroll when the track area is clicked
  private scrollDirection: 'forward' | 'backward';

  // The maximum scroll position until the end is reached
  private scrollMax: number;

  // Abstract properties and methods to be implemented by subclasses
  abstract readonly clientProperty: string;

  abstract readonly cssLengthProperty: string;

  protected abstract get viewportScrollSize(): number;

  protected abstract get viewportSize(): number;

  protected abstract get viewportScrollOffset(): number;

  abstract get size(): number;

  abstract get offset(): number;

  protected abstract scrollTo(position: number): Observable<void>;

  protected abstract getScrollDirection(position: number): 'forward' | 'backward';


  // Get track client rect
  get clientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  // Reference to the ThumbAdapter component
  @ContentChild(ThumbAdapter) protected thumb: ThumbAdapter;

  // Observable for track dragging events
  get dragged(): Observable<any> {
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
        this.currMousePosition = e[this.clientProperty];
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
          switchMap((final: boolean) => {
            // If scroll has reached the destination from the first scroll call, end the stream
            if (final) {
              return EMPTY;
            }
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
            );
          }),
          takeUntil(pointerUp$),
        );
      })
    );
  }

  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      if (this.cmp.disableSensor()) {
        this.updateCSSVariables();
        this.sizeChangeSub?.unsubscribe();
      } else {
        this.zone.runOutsideAngular(() => {
          // Update styles with real track size
          this.sizeChangeSub = resizeObserver({
            element: this.nativeElement,
            throttleDuration: this.cmp.sensorThrottleTime()
          }).pipe(
            tap(() => this.updateCSSVariables())
          ).subscribe();
        });
      }

      onCleanup(() => this.sizeChangeSub?.unsubscribe());
    });
  }

  private updateCSSVariables(): void {
    this.cmp.nativeElement.style.setProperty(this.cssLengthProperty, `${ this.size }`);
  }

  /**
   *  Callback when mouse is first clicked on the track
   */
  onTrackFirstClick(e: PointerEvent): Observable<boolean> {
    // Initialize variables and determine scroll direction
    this.currMousePosition = e[this.clientProperty];
    this.scrollDirection = this.getScrollDirection(this.currMousePosition);
    this.scrollMax = this.viewportScrollSize - this.viewportSize;

    // Calculate scroll position and trigger scroll
    let value: number;
    let final: boolean;

    // Check which direction should the scroll go (forward or backward)
    if (this.scrollDirection === 'forward') {
      // Scroll forward
      let scrollForwardIncrement: number;

      if (this.cmp.direction() === 'rtl') {
        const position: number = -(this.viewportScrollOffset - this.viewportSize);
        scrollForwardIncrement = this.scrollMax - position;
      } else {
        scrollForwardIncrement = this.viewportScrollOffset + this.viewportSize;
      }

      // Check if the incremental position is bigger than the scroll max
      if (scrollForwardIncrement >= this.scrollMax) {
        value = this.scrollMax;
        final = true;
      } else {
        value = scrollForwardIncrement;
      }
    } else {
      // Scroll backward
      let scrollBackwardIncrement: number;
      if (this.cmp.direction() === 'rtl') {
        const position: number = -(this.viewportScrollOffset + this.viewportSize);
        const scrollMax: number = this.viewportScrollSize - this.viewportSize;
        scrollBackwardIncrement = scrollMax - position;
      } else {
        scrollBackwardIncrement = this.viewportScrollOffset - this.viewportSize;
      }

      if (scrollBackwardIncrement <= 0) {
        value = 0;
        final = true;
      } else {
        value = scrollBackwardIncrement;
      }
    }

    return this.scrollTo(value).pipe(
      delay(200),
      map(() => final)
    );
  }

  /**
   * Callback when mouse is still down on the track
   * Incrementally scrolls towards target position until reached
   */
  onTrackOngoingMousedown(): Observable<boolean> {
    // Calculate scroll increments and trigger ongoing scroll
    let nextPosition: number;
    let endPosition: number;
    let isFinalStep: boolean;

    // Check which direction should the scroll go (forward or backward)
    if (this.scrollDirection === 'forward') {
      // Scroll forward
      if (this.cmp.direction() === 'rtl') {
        const position: number = this.viewportScrollOffset - this.viewportSize;
        nextPosition = this.scrollMax + position;
        endPosition = 0;
        isFinalStep = this.isFinalStep(position);
      } else {
        nextPosition = this.viewportScrollOffset + this.viewportSize;
        endPosition = this.scrollMax;
        isFinalStep = this.isFinalStep(nextPosition);
      }

    } else {
      // Scroll backward
      if (this.cmp.direction() === 'rtl') {
        const position: number = this.viewportScrollOffset + this.viewportSize;
        nextPosition = this.scrollMax + position;
        endPosition = this.scrollMax;
        isFinalStep = this.isFinalStep(position);
      } else {
        nextPosition = this.viewportScrollOffset - this.viewportSize;
        endPosition = 0;
        isFinalStep = this.isFinalStep(nextPosition);
      }
    }

    return this.scrollTo(isFinalStep ? endPosition : nextPosition).pipe(
      takeWhile(() => !isFinalStep),
      expand(() => this.onTrackOngoingMousedown())
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
    let lengthFromInputToEnd: number = this.viewportScrollSize - this.thumb.size - this.getCurrPosition(position);
    // Calculate the number of viewport sizes contained from the current position to the end of the scroll
    const numberOfViewportSizes: number = Math.floor(lengthFromInputToEnd / this.viewportSize);
    return numberOfViewportSizes === 0;
  }
}
