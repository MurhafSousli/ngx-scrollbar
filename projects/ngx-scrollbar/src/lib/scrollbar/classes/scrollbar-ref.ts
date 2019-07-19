import { ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { animationFrameScheduler, fromEvent, Observable, of, Subject } from 'rxjs';
import { delay, filter, map, mergeMap, pluck, take, takeUntil, tap } from 'rxjs/operators';

import { NgScrollbar } from '../ng-scrollbar';

export abstract class ScrollbarRef {
  // Scrollable view element
  protected readonly viewElement: HTMLElement;
  protected readonly trackElement: HTMLElement;
  protected readonly thumbElement: HTMLElement;

  protected abstract get scrollSize(): number;

  protected abstract get viewportSize(): number;

  protected abstract get trackSize(): number;

  protected abstract get thumbSize(): number;

  protected abstract get scrollOffset(): number;

  protected abstract get dragOffset(): number;

  protected abstract get offsetProperty(): string;

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
    this.viewElement = scrollbarRef.view;
    this.trackElement = trackRef.nativeElement;
    this.thumbElement = thumbRef.nativeElement;

    if (!this.scrollbarRef.disableThumbDrag && !(platform.IOS || platform.ANDROID)) {
      // Start thumb drag event
      this.dragged().pipe(
        tap((value: number) => this.scrollTo(value)),
        takeUntil(this.destroyed)
      ).subscribe();
    }

    if (!this.scrollbarRef.disableTrackClicks) {
      // Start track click event
      this.trackClicked().pipe(
        tap((value: number) =>
          this.scrollbarRef.scrollTo({
            ...this.mapToScrollToOption(value),
            duration: this.scrollbarRef.scrollToDuration
          })
        ),
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
      // throttleTime(200),
      tap(() => this.updateThumb()),
      takeUntil(this.destroyed)
    ).subscribe();

    if (!this.scrollbarRef.resizeSensor) {
      // Initialize scrollbar
      of(null).pipe(
        delay(100),
        tap(() => this.updateThumb()),
        take(1),
        takeUntil(this.destroyed)
      ).subscribe();
    }
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

  /**
   * Stream that emits when scrollbar thumb is dragged
   */
  protected dragged(): Observable<any> {
    let trackMax: number;
    let scrollMax: number;
    const thumbDragStart = fromEvent(this.thumbElement, 'mousedown', { capture: true }).pipe(
      tap(() => {
        this.document.onselectstart = () => false;
        // Capture scrollMax and trackMax once
        trackMax = this.trackMax;
        scrollMax = this.scrollMax;
      }),
      pluck(this.offsetProperty),
    );
    const thumbDragging = fromEvent(this.document, 'mousemove', { capture: true, passive: true }).pipe(
      tap((e: any) => e.stopPropagation())
    );
    const thumbDragEnd = fromEvent(this.document, 'mouseup', { capture: true }).pipe(
      tap(() => this.document.onselectstart = null)
    );
    return thumbDragStart.pipe(
      mergeMap((mouseDownOffset: number) => thumbDragging.pipe(
        pluck(this.clientProperty),
        // Calculate how far the user's mouse is from the top/left of the scrollbar (minus the dragOffset).
        map((mouseOffset: number) => mouseOffset - this.dragOffset),
        map((offset: number) => scrollMax * (offset - mouseDownOffset) / trackMax),
        map((position: number) => this.handleDragBrowserCompatibility(position, scrollMax)),
        takeUntil(thumbDragEnd)
      ))
    );
  }

  /**
   * Stream that emits when scrollbar track is clicked
   */
  protected trackClicked(): Observable<number> {
    return fromEvent(this.trackElement, 'mousedown').pipe(
      filter((e: any) => e.target === e.currentTarget),
      pluck(this.offsetProperty),
      map((clickOffset) => {
        const offset = clickOffset - (this.thumbSize / 2);
        const ratio = offset / this.trackSize;
        return ratio * this.scrollSize;
      }),
      map((position: number) => this.handleDragBrowserCompatibility(position, this.scrollMax)),
    );
  }

  // Stream that emits when view is scrolled
  protected abstract scrolled(): Observable<any>;

  /**
   * Return a scrollTo argument from value
   */
  protected abstract mapToScrollToOption(value: number): ScrollToOptions;

  /**
   * Updates scrollbar's thumb size and position
   */
  protected abstract applyThumbStyle(size: number, position: number, trackMax?: number): void;

  /**
   * On drag function
   */
  protected abstract handleDragBrowserCompatibility(position: number, scrollMax: number): number;

  protected abstract scrollTo(point: number): void;
}

/**
 * Calculate Scrollbar thumb size
 * @param trackSize Scrollbar track size
 * @param contentSize Content size or Viewport scroll size
 * @param minThumbSize Minimum scrollbar thumb size
 * @return Thumb size
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
 * @return Thumb position
 */
function calculateThumbPosition(scrollPosition: number, scrollMax: number, trackMax: number): number {
  return scrollPosition * trackMax / scrollMax;
}
