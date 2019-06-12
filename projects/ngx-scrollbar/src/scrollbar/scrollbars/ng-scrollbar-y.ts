import { ChangeDetectionStrategy, Component, Host, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animationFrameScheduler, fromEvent, Observable } from 'rxjs';
import { mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';

import { NgScrollbar } from '../ng-scrollbar';
import { NgScrollbarThumb } from './ng-scrollbar-thumb';

@Component({
  selector: 'ng-scrollbar-y',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ng-scrollbar.html',
  styleUrls: [
    './ng-scrollbar-common.scss',
    './ng-scrollbar-y.scss'
  ]
})
export class NgScrollbarY extends NgScrollbarThumb {

  /**
   * Calculate scrollbar thumbnail size
   */
  get thumbnailSize(): number {
    const barClientHeight = this.bar.nativeElement.clientHeight;
    const viewClientHeight = this.view.clientHeight;
    const viewScrollHeight = this.view.scrollHeight;
    this.naturalThumbSize = barClientHeight / viewScrollHeight * barClientHeight;
    this.scrollMax = viewScrollHeight - viewClientHeight;
    return this.scrollBoundaries(this.naturalThumbSize, this.scrollMax);
  }

  constructor(@Inject(DOCUMENT) protected document: any,
              @Host() protected parent: NgScrollbar,
              @Inject(PLATFORM_ID) platform: Object,
              protected zone: NgZone) {
    super(parent, platform, zone);
  }

  protected listenToScrollEvent(): void {
    this.scroll$ = this.parent.verticalScrollEvent.subscribe(() => this.updateScrollbar());
  }

  /**
   * Scrollbar click
   * @param e Mouse event
   */
  onScrollbarHolderClick(e: any): void {
    if (e.target === e.currentTarget) {
      const offsetY = e.offsetY - this.naturalThumbSize * .5;
      const thumbPositionPercentage = offsetY * 100 / this.bar.nativeElement.clientHeight;
      const value = thumbPositionPercentage * this.view.scrollHeight / 100;
      this.parent.scrollTo({top: value, duration: this.scrollToDuration});
    }
  }

  /**
   * Update scrollbar
   */
  protected updateScrollbar(): void {
    this.thumbSize = this.thumb.nativeElement.clientHeight;
    this.trackMax = this.bar.nativeElement.clientHeight - this.thumbSize;
    this.currPos = this.view.scrollTop * this.trackMax / this.scrollMax;
    this.zone.run(() => {
      animationFrameScheduler.schedule(() =>
        this.updateState({
          transform: `translate3d(0, ${this.currPos}px, 0)`,
          height: `${this.thumbnailSize}px`
        })
      );
    });
  }

  /**
   * Start vertical thumb worker
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
        this.trackMax = this.bar.nativeElement.clientHeight - this.thumbSize;
      }),
      pluck('offsetY'),
      mergeMap((mouseDownOffset: number) => mouseMove$.pipe(
        takeUntil(mouseUp$),
        pluck('clientY'),
        tap((mouseMoveClient: number) => {
          const offsetY = mouseMoveClient - this.bar.nativeElement.getBoundingClientRect().top;
          const value = this.scrollMax * (offsetY - mouseDownOffset) / this.trackMax;
          this.parent.scrollable.scrollTo({top: value});
        })
      ))
    );
  }
}
