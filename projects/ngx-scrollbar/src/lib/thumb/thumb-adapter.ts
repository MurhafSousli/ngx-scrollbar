import { Directive, inject, effect, NgZone, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, of, fromEvent, map, takeUntil, tap, switchMap } from 'rxjs';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { TrackAdapter } from '../track/track-adapter';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';
import { ScrollbarDragging } from '../ng-scrollbar.model';
import { ScrollbarManager } from '../utils/scrollbar-manager';

// @dynamic
@Directive()
export abstract class ThumbAdapter {

  private readonly zone: NgZone = inject(NgZone);
  protected readonly document: Document = inject(DOCUMENT);
  protected readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);
  private readonly manager: ScrollbarManager = inject(ScrollbarManager);
  private readonly track: TrackAdapter = inject(TrackAdapter);
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  // Returns either 'pageX' or 'pageY' according to scrollbar axis
  protected abstract get pageProperty(): string;

  // Returns either 'clientHeight' or 'clientWidth' according to scrollbar axis
  protected abstract get clientProperty(): string;

  abstract get dragStartOffset(): number;

  abstract get offset(): number;

  // Returns thumb size, clientHeight or clientWidth
  abstract get size(): number;

  abstract get viewportScrollMax(): number;

  protected abstract axis: 'x' | 'y';

  protected animation: Animation;

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
      switchMap((e: PointerEvent) => {
        let trackMaxStart: number;
        let scrollMaxStart: number;

        const dragStart: Observable<PointerEvent> = of<PointerEvent>(e).pipe(
          preventSelection(this.document),
          tap(() => {
            // Capture scrollMax and trackMax once
            trackMaxStart = this.trackMax;
            scrollMaxStart = this.viewportScrollMax;
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
          map((e: PointerEvent) => e[this.pageProperty]),
          map((pageOffset: number) => pageOffset - this.dragStartOffset),
          switchMap((mouseDownOffset: number) => dragging.pipe(
            map((e: PointerEvent) => e[this.clientProperty]),
            // Calculate how far the pointer is from the top/left of the scrollbar (minus the dragOffset).
            map((mouseOffset: number) => mouseOffset - this.track.offset),
            map((offset: number) => scrollMaxStart * (offset - mouseDownOffset) / trackMaxStart),
            map((position: number) => this.handleDrag(position, scrollMaxStart)),
            tap((position: number) => this.scrollTo(position)),
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
