import { NgZone } from '@angular/core';
import { animationFrameScheduler, fromEvent, Observable } from 'rxjs';
import { mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';
import { CustomScrollbar } from './custom-scrollbar';
import { NgScrollbar } from '../../ng-scrollbar';

export class HorizontalScrollbar extends CustomScrollbar {

  constructor(protected scrollbarRef: NgScrollbar,
              protected document: any,
              protected zone: NgZone,
              protected containerElement: HTMLElement,
              protected thumbnailElement: HTMLElement) {
    super(scrollbarRef, document, zone, containerElement, thumbnailElement);
  }

  /**
   * Sets the thumbnail size for the horizontal scrollbar
   */
  protected updateScrollbarThumbnailSize(): void {
    const barClientWidth = this.containerElement.clientWidth;
    const viewClientWidth = this.viewElement.clientWidth;
    const viewScrollWidth = this.viewElement.scrollWidth;
    this.naturalThumbSize = barClientWidth / viewScrollWidth * barClientWidth;
    this.scrollMax = viewScrollWidth - viewClientWidth;
    this.thumbnailSize = this.scrollBoundaries(this.naturalThumbSize, this.scrollMax);
  }

  protected listenToScrollEvent(): Observable<any> {
    return this.scrollbarRef.horizontalScrolled;
  }

  /**
   * Scrolls to the clicked position on scrollbar container
   */
  containerClick(e: any): void {
    if (e.target === e.currentTarget) {
      const offsetX = e.offsetX - this.naturalThumbSize * .5;
      const thumbPositionPercentage = offsetX * 100 / this.containerElement.clientWidth;
      const value = thumbPositionPercentage * this.viewElement.scrollWidth / 100;
      this.scrollbarRef.scrollTo({left: value, duration: this.scrollbarRef.scrollToDuration});
    }
  }

  /**
   * Update scrollbar
   */
  protected updateScrollbarThumbnailPosition(): void {
    this.thumbSize = this.thumbnailElement.clientWidth;
    this.trackMax = this.containerElement.clientWidth - this.thumbSize;
    this.currPos = this.viewElement.scrollLeft * this.trackMax / this.scrollMax;
    this.zone.run(() => {
      animationFrameScheduler.schedule(() =>
        this.updateState({
          transform: `translate3d(${this.currPos}px, 0, 0)`,
          width: `${this.thumbnailSize}px`
        })
      );
    });
  }

  /**
   * Start horizontal thumb worker
   */
  protected startThumbEvents(): Observable<any> {
    const mouseDown$: Observable<any> = fromEvent(this.thumbnailElement, 'mousedown');
    const mouseMove$: Observable<any> = fromEvent(this.document, 'mousemove');
    const mouseUp$: Observable<any> = fromEvent(this.document, 'mouseup').pipe(
      tap(() => this.document.onselectstart = null)
    );
    return mouseDown$.pipe(
      tap(() => {
        this.document.onselectstart = () => false;
        // Initialize trackMax for before start dragging
        this.trackMax = this.containerElement.clientWidth - this.thumbnailSize;
      }),
      pluck('offsetX'),
      mergeMap((mouseDownOffset: number) => mouseMove$.pipe(
        takeUntil(mouseUp$),
        pluck('clientX'),
        tap((mouseMoveClient: number) => {
          const offsetX = mouseMoveClient - this.containerElement.getBoundingClientRect().left;
          const value = this.scrollMax * (offsetX - mouseDownOffset) / this.trackMax;
          /**
           * TODO: fix RTL
           */
          // if (this.dir.value === 'rtl') {
          // value = value === 0 ? this.trackMax - offsetX : value;
          // }
          this.scrollbarRef.scrollTo({left: value});
        })
      ))
    );
  }
}
