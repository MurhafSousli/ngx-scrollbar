import { ContentChild, Directive, inject, effect, ElementRef, EffectCleanupRegisterFn } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Observable,
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
  EMPTY, Subscription
} from 'rxjs';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { ThumbAdapter } from '../thumb/thumb-adapter';
import { resizeSensor } from '../viewport';


// @dynamic
@Directive()
export abstract class TrackAdapter {

  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  protected readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);
  protected readonly document: Document = inject(DOCUMENT);

  /** Resize observer subscription */
  private sizeChangeSub: Subscription;

  protected abstract get viewportScrollSize(): number;

  protected abstract get viewportViewportSize(): number;

  protected abstract get viewportScrollOffset(): number;

  // The active mouse event for the ongoing track dragging
  private currMousePosition: number;
  private scrollDirection: 'forward' | 'backward';

  @ContentChild(ThumbAdapter) private thumb: ThumbAdapter;

  get dragged(): Observable<any> {
    const mouseDown$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerdown').pipe(
      stopPropagation(),
      preventSelection(this.document)
    );
    const mouseUp$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { passive: true }).pipe(
      enableSelection(this.document)
    );

    // The reason why we use mousemove instead of mouseover, that we need to save the current mouse location
    const mouseMove$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointermove', { passive: true }).pipe(
      map((e: PointerEvent) => {
        this.currMousePosition = e[this.clientProperty];
        return true;
      })
    );

    const mouseOut$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointerout', { passive: true }).pipe(
      map(() => {
        return false;
      })
    );

    // Stream that combines mousemove and mouseover and only emit when mouse gets in or out the track
    // NOTE: we must use a BehaviorSubject to get the value asap the onTrackFirstClick function is called
    const mouseOverTrack$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    return mouseDown$.pipe(
      switchMap((startEvent: PointerEvent) => {
        // We need to subscribe to mousemove and mouseout events before calling the onTrackFirstClick
        // Because we need to tell if mouse is over or not asap the first function is done
        // Otherwise, if user click first time and moved the mouse away immediately, the mouseout will not be detected
        merge(mouseMove$, mouseOut$).pipe(
          distinctUntilChanged(),
          tap((over: boolean) => mouseOverTrack$.next(over)),
          takeUntil(mouseUp$)
        ).subscribe();

        // TODO: Verify if this is needed
        // This should stop propagating the move event when pointer is moving over the thumb
        fromEvent(this.thumb.nativeElement, 'pointermove').pipe(
          stopPropagation(),
          takeUntil(mouseUp$)
        ).subscribe();

        return this.onTrackFirstClick(startEvent).pipe(
          switchMap((final: boolean) => {
            // If scroll has reached the destination from the first scroll call, end the stream
            if (final) {
              return EMPTY;
            }
            // Otherwise, activate mousemove and mouseout events and switch to ongoing scroll calls
            return mouseOverTrack$.pipe(
              switchMap((over: boolean) => {
                const currDirection = this.getScrollDirection();
                const sameDirection: boolean = this.scrollDirection === currDirection;
                // If mouse is out the track pause the scroll calls, otherwise keep going
                return (over && sameDirection) ? this.onTrackOngoingMousedown() : EMPTY;
              }),
              finalize(() => {
                // Reset the mouseOverTrack$ state
                mouseOverTrack$.next(true);
              })
            );
          }),
          takeUntil(mouseUp$),
        );
      })
    );
  }

  abstract readonly cssLengthProperty: string;

  abstract readonly clientProperty: string;

  // Returns the track size, clientHeight or clientWidth
  abstract get size(): number;

  // Returns the start offset either 'clientRect.top' or 'clientRect.left'
  abstract get offset(): number;

  // Get track client rect
  get clientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  private getScrollDirection(): 'forward' | 'backward' {
    return this.currMousePosition - this.thumb.offset > 0 ? 'forward' : 'backward';
  }

  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      if (this.cmp.disableSensor()) {
        this.updateCSSVariables();
        this.sizeChangeSub?.unsubscribe();
      } else {
        this.sizeChangeSub = resizeSensor({
          element: this.nativeElement,
          throttleDuration: this.cmp.sensorThrottleTime()
        }).pipe(
          tap(() => this.updateCSSVariables())
        ).subscribe();
      }

      onCleanup(() => this.sizeChangeSub?.unsubscribe());
    });
  }

  private updateCSSVariables(): void {
    this.cmp.nativeElement.style.setProperty(this.cssLengthProperty, `${ this.size }`);
  }

  /**
   * Scrolls to position when mouse is down the on the track the first time
   */
  onTrackFirstClick(e: PointerEvent): Observable<boolean> {
    this.currMousePosition = e[this.clientProperty];
    // Save scroll direction
    this.scrollDirection = this.getScrollDirection();

    let value: number;
    let final: boolean;

    // Check which direction should the scroll go (up or down)
    if (this.scrollDirection === 'forward') {
      // Scroll down
      const scrollDownIncrement: number = this.viewportScrollOffset + this.viewportViewportSize;
      // Check if the incremental position is bigger than the scroll max
      const scrollMax: number = this.viewportScrollSize - this.viewportViewportSize;
      if (scrollDownIncrement >= scrollMax) {
        value = scrollMax;
        final = true;
      } else {
        value = scrollDownIncrement;
      }
    } else {
      // Scroll up
      const scrollUpIncrement: number = this.viewportScrollOffset - this.viewportViewportSize;
      if (scrollUpIncrement <= 0) {
        value = 0;
        final = true;
      } else {
        value = scrollUpIncrement;
      }
    }

    return this.scrollTo(value).pipe(
      delay(200),
      map(() => final)
    );
  }

  /**
   * Callback that is called when mouse is still down on the track
   */
  onTrackOngoingMousedown(): Observable<boolean> {
    const scrollFinal: number = this.getRelativePosition();

    let value: number;
    let final: boolean;

    // Check which direction should the scroll go (up or down)
    if (this.scrollDirection === 'forward') {
      // Scroll down
      const scrollDownIncrement: number = this.viewportScrollOffset + this.viewportViewportSize;
      // Check if the incremental position is bigger than the scroll max
      if (scrollDownIncrement >= scrollFinal) {
        value = scrollFinal;
        final = true;
      } else {
        value = scrollDownIncrement;
      }
    } else {
      // Scroll up
      const scrollUpIncrement: number = this.viewportScrollOffset - this.viewportViewportSize;
      if (scrollUpIncrement <= scrollFinal) {
        value = scrollFinal;
        final = true;
      } else {
        value = scrollUpIncrement;
      }
    }

    return this.scrollTo(value).pipe(
      takeWhile(() => !final),
      expand(() => this.onTrackOngoingMousedown())
    );
  }

  private getRelativePosition(): number {
    const clickPosition: number = this.currMousePosition - this.offset;
    const current: number = clickPosition / this.size;
    return current * (this.viewportScrollSize - this.viewportViewportSize);
  }

  protected abstract scrollTo(position: number): Observable<void>;
}
