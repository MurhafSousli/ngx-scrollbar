import { ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { animationFrameScheduler, asyncScheduler, EMPTY, fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, pluck, switchMap, takeUntil, tap } from 'rxjs/operators';

import { NgScrollbar } from '../ng-scrollbar';

export abstract class ScrollbarRef {
  // Scrollable view element
  protected readonly viewElement: HTMLElement;
  protected readonly trackElement: HTMLElement;
  protected readonly thumbElement: HTMLElement;

  protected readonly hoveredState: Subject<boolean>;
  protected readonly draggingState: Subject<boolean>;

  // Pointer events switcher stream
  protected readonly pointerEvents: Subject<boolean>;

  protected abstract get scrollSize(): number;

  protected abstract get viewportSize(): number;

  protected abstract get trackSize(): number;

  protected abstract get thumbSize(): number;

  protected abstract get scrollOffset(): number;

  protected abstract get dragStartOffset(): number;

  protected abstract get dragOffset(): number;

  protected abstract get pageProperty(): string;

  protected abstract get clientProperty(): string;

  // The available scrollable size
  protected get scrollMax(): number {
    return this.scrollSize - this.viewportSize;
  }

  protected get trackMax(): number {
    return this.trackSize - this.thumbSize;
  }

  protected constructor(protected scrollbarRef: NgScrollbar,
                        protected document: any,
                        trackRef: ElementRef,
                        thumbRef: ElementRef,
                        platform: Platform,
                        protected destroyed: Subject<void>) {
    this.viewElement = scrollbarRef.viewport;
    this.trackElement = trackRef.nativeElement;
    this.thumbElement = thumbRef.nativeElement;

    if (!(platform.IOS || platform.ANDROID)) {

      this.pointerEvents = new Subject<boolean>();
      this.hoveredState = new Subject<boolean>();
      this.draggingState = new Subject<boolean>();

      this.draggingState.pipe(
        distinctUntilChanged(),
        tap((state: boolean) => this.setDragging(state)),
        takeUntil(this.destroyed)
      ).subscribe();

      const scrollbarClicked = fromEvent(this.viewElement, 'mousedown', { passive: true }).pipe(
        switchMap((e: any) => {
          e.stopPropagation();
          this.document.onselectstart = () => false;
          const isThumbClick = isWithinBounds(e, this.thumbElement.getBoundingClientRect());
          if (isThumbClick && !coerceBooleanProperty(this.scrollbarRef.thumbDragDisabled)) {
            return this.dragged(e);
          } else {
            const isTrackClick = isWithinBounds(e, this.trackElement.getBoundingClientRect());
            if (isTrackClick && !coerceBooleanProperty(this.scrollbarRef.trackClickDisabled)) {
              return this.trackClicked(e);
            }
          }
          return EMPTY;
        })
      );

      // Activate/Deactivate scrollbar hover event
      const mouseLeave = fromEvent(this.viewElement, 'mouseleave').pipe(
        map((e: any) => {
          e.stopPropagation();
          return false;
        })
      );
      merge(this.pointerEvents, mouseLeave).pipe(distinctUntilChanged()).pipe(
        tap((state: boolean) => this.setHovered(state)),
        takeUntil(this.destroyed)
      ).subscribe();

      // Activate/Deactivate scrollTo on scrollbar click event
      this.pointerEvents.pipe(
        distinctUntilChanged(),
        switchMap((state: boolean) => state ? scrollbarClicked : EMPTY),
        takeUntil(this.destroyed)
      ).subscribe();

      this.hovered().pipe(
        tap((state: boolean) => this.pointerEvents.next(state)),
        takeUntil(this.destroyed)
      ).subscribe();
    }

    // Start updating thumb position when view scrolls
    this.scrolled().pipe(
      tap(() => this.updateThumb()),
      takeUntil(this.destroyed)
    ).subscribe();

    // Update scrollbar when `NgScrollbar.update()` is called
    this.scrollbarRef.updated.pipe(
      tap(() => this.updateThumb()),
      takeUntil(this.destroyed)
    ).subscribe();

    // Initialize scrollbar
    asyncScheduler.schedule(() => this.updateThumb(), 100);
  }

  /**
   * Updates scrollbar's thumb position and size
   */
  protected updateThumb(): void {
    const trackMax = this.trackMax;
    const size = calculateThumbSize(this.trackSize, this.scrollSize, this.scrollbarRef.minThumbSize);
    const position = calculateThumbPosition(this.scrollOffset, this.scrollMax, trackMax);
    animationFrameScheduler.schedule(() => this.applyThumbStyle(size, position, trackMax));
  }

  dragged(event: any) {
    let trackMax: number;
    let scrollMax: number;

    const dragStart = of(event).pipe(
      tap(() => {
        // Capture scrollMax and trackMax once
        trackMax = this.trackMax;
        scrollMax = this.scrollMax;
        this.draggingState.next(true);
      }),
    );

    const dragging = fromEvent(this.document, 'mousemove', { capture: true, passive: true }).pipe(
      tap((e: any) => e.stopPropagation())
    );

    const dragEnd = fromEvent(this.document, 'mouseup', { capture: true }).pipe(
      tap((e: any) => {
        e.stopPropagation();
        this.document.onselectstart = null;
        this.draggingState.next(false);
      })
    );

    return dragStart.pipe(
      pluck(this.pageProperty),
      map((pageOffset: number) => pageOffset - this.dragStartOffset),
      mergeMap((mouseDownOffset: number) => dragging.pipe(
        pluck(this.clientProperty),
        // Calculate how far the user's mouse is from the top/left of the scrollbar (minus the dragOffset).
        map((mouseOffset: number) => mouseOffset - this.dragOffset),
        map((offset: number) => scrollMax * (offset - mouseDownOffset) / trackMax),
        map((position: number) => this.handleDragPosition(position, scrollMax)),
        tap((value: number) => this.scrollTo(value)),
        takeUntil(dragEnd)
      ))
    );
  }

  /**
   * Stream that emits when a scrollbar is hovered
   */
  private hovered(): Observable<boolean> {
    return fromEvent(this.viewElement, 'mousemove', { passive: true }).pipe(
      map((e: any) => {
        e.stopPropagation();
        return isWithinBounds(e, this.trackElement.getBoundingClientRect());
      })
    );
  }

  /**
   * Stream that emits when scrollbar track is clicked
   */
  protected trackClicked(e): Observable<number> {
    return of(e).pipe(
      pluck(this.pageProperty),
      map((pageOffset: number) => pageOffset - this.dragOffset),
      map((clickOffset: number) => {
        const offset = clickOffset - (this.thumbSize / 2);
        const ratio = offset / this.trackSize;
        return ratio * this.scrollSize;
      }),
      tap((value: number) =>
        this.scrollbarRef.scrollTo({
          ...this.mapToScrollToOption(value),
          duration: coerceNumberProperty(this.scrollbarRef.trackClickScrollDuration)
        })
      ),
      tap(() => this.document.onselectstart = null)
    );
  }

  /**
   * Stream that emits when view is scrolled
   */
  protected abstract scrolled(): Observable<any>;

  /**
   * Return a scrollTo option parameter
   */
  protected abstract mapToScrollToOption(value: number): ScrollToOptions;

  /**
   * Updates scrollbar's thumb size and position
   */
  protected abstract applyThumbStyle(size: number, position: number, trackMax?: number): void;

  /**
   * On drag function
   */
  protected abstract handleDragPosition(position: number, scrollMax: number): number;

  protected abstract scrollTo(point: number): void;

  protected abstract setDragging(value: boolean): void;

  protected abstract setHovered(value: boolean): void;
}

/**
 * Calculate Scrollbar thumb size
 * @param trackSize Scrollbar track size
 * @param contentSize Content size or Viewport scroll size
 * @param minThumbSize Minimum scrollbar thumb size
 */
function calculateThumbSize(trackSize: number, contentSize: number, minThumbSize: number): number {
  const scrollbarRatio = trackSize / contentSize;
  const thumbSize = scrollbarRatio * trackSize;
  return Math.max(~~thumbSize, minThumbSize);
}

/**
 * Calculate scrollbar thumb position
 * @param scrollPosition The scroll position of the viewport
 * @param scrollMax The max size available to scroll the viewport
 * @param trackMax The max size available to move scrollbar thumb
 */
function calculateThumbPosition(scrollPosition: number, scrollMax: number, trackMax: number): number {
  return scrollPosition * trackMax / scrollMax;
}

/**
 * Check if pointer is within scrollbar bounds
 * @param e Pointer event
 * @param rect Scrollbar Client Rect
 */
function isWithinBounds(e: any, rect: ClientRect): boolean {
  return (
    e.clientX >= rect.left &&
    e.clientX <= rect.left + rect.width &&
    e.clientY >= rect.top &&
    e.clientY <= rect.top + rect.height
  );
}
