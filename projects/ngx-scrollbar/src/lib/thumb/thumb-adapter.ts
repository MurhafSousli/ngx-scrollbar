import { Directive, inject, untracked, afterRenderEffect } from '@angular/core';
import { Observable, of, fromEvent, map, takeUntil, tap, switchMap } from 'rxjs';
import {
  ScrollbarDragging,
  ScrollTimelineFunc,
  stopPropagation,
  enableSelection,
  preventSelection
} from '../utils/common';
import { ScrollbarManager } from '../utils/scrollbar-manager';
import { TrackAdapter } from '../track/track-adapter';
import { PointerEventsAdapter } from '../utils/pointer-events-adapter';

@Directive()
export abstract class ThumbAdapter extends PointerEventsAdapter {

  protected readonly manager: ScrollbarManager = inject(ScrollbarManager);

  private readonly track: TrackAdapter = inject(TrackAdapter);

  // The animation reference used for enabling the polyfill on Safari and Firefox.
  _animation: Animation;

  // Returns thumb size
  get size(): number {
    return this.nativeElement.getBoundingClientRect()[this.control.rectSizeProperty];
  }

  // The maximum space available for scrolling.
  get trackMax(): number {
    return this.track.size - this.size;
  }

  /**
   * Stream that emits the 'scrollTo' position when a scrollbar thumb element is dragged
   * This function is called by thumb drag event using viewport or scrollbar pointer events
   */
  get pointerEvents(): Observable<PointerEvent> {
    return fromEvent<PointerEvent>(this.nativeElement, 'pointerdown').pipe(
      stopPropagation(),
      preventSelection(this.document),
      switchMap((e: PointerEvent) => {
        let startTrackMax: number;
        let startScrollMax: number;

        const dragStart: Observable<PointerEvent> = of<PointerEvent>(e).pipe(
          tap(() => {
            // Capture scrollMax and trackMax once
            startTrackMax = this.trackMax;
            startScrollMax = this.control.viewportScrollMax;
            this.setDragging(this.control.axis);
          }),
        );

        const dragging: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointermove').pipe(stopPropagation());

        const dragEnd: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { capture: true }).pipe(
          stopPropagation(),
          enableSelection(this.document),
          tap(() => this.setDragging('none'))
        );

        return dragStart.pipe(
          map((startEvent: PointerEvent) => startEvent[this.control.offsetProperty]),
          switchMap((startOffset: number) => dragging.pipe(
            map((moveEvent: PointerEvent) => moveEvent[this.control.clientProperty]),
            // Calculate how far the pointer is from the top/left of the scrollbar (minus the dragOffset).
            map((moveClient: number) => moveClient - this.track.offset),
            map((trackRelativeOffset: number) => startScrollMax * (trackRelativeOffset - startOffset) / startTrackMax),
            tap((scrollPosition: number) => this.control.instantScrollTo(scrollPosition, startScrollMax)),
            takeUntil(dragEnd)
          ) as Observable<PointerEvent>)
        );
      })
    );
  }

  constructor() {
    afterRenderEffect({
      earlyRead: (): void => {
        const script: ScrollTimelineFunc = this.manager.scrollTimelinePolyfill();
        untracked(() => {
          if (script && !this._animation) {
            this._animation = startPolyfill(script, this.nativeElement, this.cmp.viewport.nativeElement, this.control.axis);
          }
        });
      }
    });
    super();
  }

  private setDragging(value: ScrollbarDragging): void {
    this.zone.run(() => this.cmp.dragging.set(value));
  }
}

function startPolyfill(ScrollTimeline: ScrollTimelineFunc, element: HTMLElement, source: HTMLElement, axis: 'x' | 'y'): Animation {
  return element.animate(
    {
      translate: [
        'var(--_scrollbar-thumb-transform-from)',
        'var(--_scrollbar-thumb-transform-to)'
      ]
    },
    {
      fill: 'both',
      easing: 'linear',
      timeline: new ScrollTimeline({ source, axis })
    }
  );
}
