import { Output, Directive } from '@angular/core';
import { Observable, Subject, animationFrameScheduler, of, fromEvent, distinctUntilChanged, map, mergeMap, takeUntil, tap } from 'rxjs';
import { enableSelection, preventSelection, stopPropagation } from '../common';
import { TrackAdapter } from '../track/track';
import { NgScrollbarBase } from '../../ng-scrollbar-base';

// @dynamic
@Directive()
export abstract class ThumbAdapter {

  // Stream that emits dragging state
  private _dragging = new Subject<boolean>();
  @Output() dragging = this._dragging.pipe(distinctUntilChanged());

  // Returns either 'pageX' or 'pageY' according to scrollbar axis
  protected abstract get pageProperty(): string;

  // Returns either 'clientHeight' or 'clientWidth' according to scrollbar axis
  protected abstract get clientProperty(): string;

  abstract get dragStartOffset(): number;

  // Returns thumb size, clientHeight or clientWidth
  abstract get size(): number;

  protected abstract get viewportScrollSize(): number;

  protected abstract get viewportScrollOffset(): number;

  abstract get viewportScrollMax(): number;

  get trackMax(): number {
    return this.track!.size - this.size;
  }

  // Get thumb client rect
  get clientRect(): DOMRect {
    return this.thumbElement.getBoundingClientRect();
  }

  // Stream that emits when scrollbar thumb is clicked
  get clicked(): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(this.thumbElement, 'mousedown', { passive: true }).pipe(stopPropagation());
  }

  protected constructor(protected cmp: NgScrollbarBase,
                        protected track: TrackAdapter,
                        protected thumbElement: HTMLElement,
                        protected document: Document) {
  }

  // Calculate and update thumb position and size
  update() {
    const size = calculateThumbSize(this.track!.size, this.viewportScrollSize, this.cmp.minThumbSize!);
    const position = calculateThumbPosition(this.viewportScrollOffset, this.viewportScrollMax, this.trackMax);
    animationFrameScheduler.schedule(() => this.updateStyles(this.handleDirection(position, this.trackMax), size));
  }

  /**
   * Stream that emits the 'scrollTo' position when a scrollbar thumb element is dragged
   * This function is called by thumb drag event using viewport or scrollbar pointer events
   */
  dragged(event: MouseEvent): Observable<number> {
    let trackMaxStart: number;
    let scrollMaxStart: number;

    const dragStart: Observable<MouseEvent> = of<MouseEvent>(event).pipe(
      preventSelection(this.document),
      tap(() => {
        // Capture scrollMax and trackMax once
        trackMaxStart = this.trackMax;
        scrollMaxStart = this.viewportScrollMax;
        this.setDragging(true);
      }),
    );

    const dragging: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mousemove', { capture: true, passive: true }).pipe(stopPropagation());

    const dragEnd: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mouseup', { capture: true }).pipe(
      stopPropagation(),
      enableSelection(this.document),
      tap(() => this.setDragging(false))
    );

    return dragStart.pipe(
      map((e: MouseEvent) => e[this.pageProperty]),
      map((pageOffset: number) => pageOffset - this.dragStartOffset),
      mergeMap((mouseDownOffset: number) => dragging.pipe(
        map((e: MouseEvent) => e[this.clientProperty]),
        // Calculate how far the pointer is from the top/left of the scrollbar (minus the dragOffset).
        map((mouseOffset: number) => mouseOffset - this.track!.offset),
        map((offset: number) => scrollMaxStart * (offset - mouseDownOffset) / trackMaxStart),
        map((position: number) => this.handleDrag(position, scrollMaxStart)),
        tap((position: number) => this.scrollTo(position)),
        takeUntil(dragEnd)
      ))
    );
  }

  // Set dragging state
  protected abstract setDragging(value: boolean): void;

  // Scroll viewport instantly
  protected abstract scrollTo(position: number): void;

  // Update thumb element size and position
  protected abstract updateStyles(position: number, size: number): void;

  // Handle dragging position (Support LTR and RTL directions for the horizontal scrollbar)
  protected abstract handleDrag(position: number, scrollMax?: number): number;

  // Handle scrolling position (Support LTR and RTL directions for the horizontal scrollbar)
  protected abstract handleDirection(position: number, scrollMax?: number): number;
}

/**
 * Calculate scrollbar thumb size
 */
function calculateThumbSize(trackSize: number, contentSize: number, minThumbSize: number): number {
  const scrollbarRatio = trackSize / contentSize;
  const thumbSize = scrollbarRatio * trackSize;
  return Math.max(~~thumbSize, minThumbSize);
}

/**
 * Calculate scrollbar thumb position
 */
function calculateThumbPosition(scrollPosition: number, scrollMax: number, trackMax: number): number {
  return scrollPosition * trackMax / scrollMax;
}
