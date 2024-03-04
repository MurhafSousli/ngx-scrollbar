import { Directive, inject, effect, NgZone, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, of, fromEvent, map, takeUntil, tap, switchMap } from 'rxjs';
import { ScrollbarDragging, enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';
import { ScrollbarManager } from '../utils/scrollbar-manager';
import { TrackAdapter } from '../track/track-adapter';

// @dynamic
@Directive()
export abstract class ThumbAdapter {

  private readonly zone: NgZone = inject(NgZone);
  protected readonly document: Document = inject(DOCUMENT);
  protected readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);
  protected readonly manager: ScrollbarManager = inject(ScrollbarManager);
  private readonly track: TrackAdapter = inject(TrackAdapter);
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  // The animation reference used for enabling the polyfill on Safari and Firefox.
  protected animation: Animation;

  // Returns either 'clientX' or 'clientY' coordinate of the pointer relative to the viewport
  protected abstract readonly clientProperty: 'clientX' | 'clientY';

  protected abstract get dragStartOffset(): number;

  abstract get offset(): number;

  // Returns thumb size
  abstract get size(): number;

  protected abstract get viewportScrollMax(): number;

  protected abstract axis: 'x' | 'y';

  // The maximum space available for scrolling.
  get trackMax(): number {
    return this.track.size - this.size;
  }

  // Get thumb client rect
  get clientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  /**
   * Stream that emits the 'scrollTo' position when a scrollbar thumb element is dragged
   * This function is called by thumb drag event using viewport or scrollbar pointer events
   */
  get dragged(): Observable<number> {
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
            startScrollMax = this.viewportScrollMax;
            this.setDragging(this.axis);
          }),
        );

        const dragging: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointermove').pipe(stopPropagation());

        const dragEnd: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { capture: true }).pipe(
          stopPropagation(),
          enableSelection(this.document),
          tap(() => this.setDragging('none'))
        );

        return dragStart.pipe(
          map((startEvent: PointerEvent) => startEvent[this.clientProperty]),
          map((startClientOffset: number) => startClientOffset - this.dragStartOffset),
          switchMap((pointerDownOffset: number) => dragging.pipe(
            map((moveEvent: PointerEvent) => moveEvent[this.clientProperty]),
            // Calculate how far the pointer is from the top/left of the scrollbar (minus the dragOffset).
            map((moveClientOffset: number) => moveClientOffset - this.track.offset),
            map((trackRelativeOffset: number) => startScrollMax * (trackRelativeOffset - pointerDownOffset) / startTrackMax),
            map((scrollPosition: number) => this.handleDrag(scrollPosition, startScrollMax)),
            tap((finalScrollPosition: number) => this.scrollTo(finalScrollPosition)),
            takeUntil(dragEnd)
          ))
        );
      })
    );
  }

  constructor() {
    effect(() => {
      const script: any = this.manager.scrollTimelinePolyfill();
      if (script && !this.animation) {
        this.animation = startPolyfill(script, this.nativeElement, this.cmp.viewport.nativeElement, this.axis);
      }
    });
  }

  private setDragging(value: ScrollbarDragging): void {
    this.zone.run(() => this.cmp.dragging.set(value));
  }

  // Scroll viewport instantly
  protected abstract scrollTo(position: number): void;

  // Handle dragging position (Support LTR and RTL directions for the horizontal scrollbar)
  protected abstract handleDrag(position: number, scrollMax?: number): number;
}

function startPolyfill(ScrollTimeline: any, element: HTMLElement, source: HTMLElement, axis: 'x' | 'y'): Animation {
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
    } as any
  );
}
