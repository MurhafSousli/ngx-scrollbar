import { Component, Inject, NgZone, ChangeDetectionStrategy, PLATFORM_ID, Host } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable, animationFrameScheduler } from 'rxjs';
import { mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';

import { NgScrollbar } from '../ng-scrollbar';
import { NgScrollbarThumb } from './ng-scrollbar-thumb';

@Component({
  selector: 'ng-scrollbar-x',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ng-scrollbar.html',
  styleUrls: [
    './ng-scrollbar-common.scss',
    './ng-scrollbar-x.scss'
  ]
})
export class NgScrollbarX extends NgScrollbarThumb {

  /**
   * Calculate scrollbar thumbnail size
   */
  get thumbnailSize(): number {
    const barClientWidth = this.bar.nativeElement.clientWidth;
    const viewClientWidth = this.view.clientWidth;
    const viewScrollWidth = this.view.scrollWidth;
    this.naturalThumbSize = barClientWidth / viewScrollWidth * barClientWidth;
    this.scrollMax = viewScrollWidth - viewClientWidth;
    return this.scrollBoundaries(this.naturalThumbSize, this.scrollMax);
  }

  constructor(@Inject(DOCUMENT) protected document: any,
              @Host() protected parent: NgScrollbar,
              @Inject(PLATFORM_ID) platform: Object,
              protected zone: NgZone) {
    super(parent, platform, zone);
  }

  protected listenToScrollEvent(): void {
    this.scroll$ = this.parent.horizontalScrollEvent.subscribe(() => this.updateScrollbar());
  }


  /**
   * Scrollbar click
   * @param e Mouse event
   */
  onScrollbarHolderClick(e: any): void {
    if (e.target === e.currentTarget) {
      const offsetX = e.offsetX - this.naturalThumbSize * .5;
      const thumbPositionPercentage = offsetX * 100 / this.bar.nativeElement.clientWidth;
      const value = thumbPositionPercentage * this.view.scrollWidth / 100;
      this.parent.scrollTo({left: value, duration: this.parent.scrollToDuration});
    }
  }

  /**
   * Update scrollbar
   */
  protected updateScrollbar(): void {
    this.thumbSize = this.thumb.nativeElement.clientWidth;
    this.trackMax = this.bar.nativeElement.clientWidth - this.thumbSize;
    this.currPos = this.view.scrollLeft * this.trackMax / this.scrollMax;
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
    const mouseDown$ = fromEvent(this.thumb.nativeElement, 'mousedown');
    const mouseMove$ = fromEvent(this.document, 'mousemove');
    const mouseUp$ = fromEvent(this.document, 'mouseup').pipe(
      tap(() => this.document.onselectstart = null)
    );
    return mouseDown$.pipe(
      tap(() => {
        this.document.onselectstart = () => false;
        // Initialize trackMax for before start dragging
        this.trackMax = this.bar.nativeElement.clientWidth - this.thumbnailSize;
      }),
      pluck('offsetX'),
      mergeMap((mouseDownOffset: number) => mouseMove$.pipe(
        takeUntil(mouseUp$),
        pluck('clientX'),
        tap((mouseMoveClient: number) => {
          const offsetX = mouseMoveClient - this.bar.nativeElement.getBoundingClientRect().left;
          const value = this.scrollMax * (offsetX - mouseDownOffset) / this.trackMax;
          /**
           * TODO: fix RTL
           */
          // if (this.dir.value === 'rtl') {
            // value = value === 0 ? this.trackMax - offsetX : value;
          // }
          this.parent.scrollable.scrollTo({left: value});
        })
      ))
    );
  }
}
