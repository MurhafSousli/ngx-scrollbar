import { Component, Inject, NgZone, ChangeDetectionStrategy, forwardRef, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable, animationFrameScheduler } from 'rxjs';
import { mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarThumb } from './ng-scrollbar-thumb';

@Component({
  selector: 'ng-scrollbar-y',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #bar class="ng-scrollbar {{barClass}}" (mousedown)="onScrollbarHolderClick($event)">
      <div #thumb class="ng-scrollbar-thumb {{thumbClass}}" [ngStyle]="scrollbarStyle | async"></div>
    </div>
  `
})
export class NgScrollbarY extends NgScrollbarThumb {

  /**
   * Calculate scrollbar thumbnail size
   */
  get thumbSize(): number {
    const barClientHeight = this.bar.nativeElement.clientHeight;
    const viewClientHeight = this._view.clientHeight;
    const viewScrollHeight = this._view.scrollHeight;
    this._naturalThumbSize = barClientHeight / viewScrollHeight * barClientHeight;
    this._scrollMax = viewScrollHeight - viewClientHeight;
    return this.scrollBoundaries(this._naturalThumbSize, this._scrollMax);
  }

  constructor(@Inject(DOCUMENT) protected _document: any,
              @Inject(forwardRef(() => NgScrollbar)) protected _parent: NgScrollbar,
              @Inject(PLATFORM_ID) _platform: Object,
              protected _zone: NgZone) {
    super(_parent, _platform, _zone);
  }

  /**
   * Scrollbar click
   * @param e Mouse event
   */
  onScrollbarHolderClick(e: any) {
    if (e.target === e.currentTarget) {
      const offsetY = e.offsetY - this._naturalThumbSize * .5;
      const thumbPositionPercentage = offsetY * 100 / this.bar.nativeElement.clientHeight;
      const value = thumbPositionPercentage * this._view.scrollHeight / 100;
      this._parent.scrollTo({top: value, duration: this.scrollToDuration} as any).subscribe();
    }
  }

  /**
   * Update scrollbar
   */
  protected updateScrollbar() {
    this._thumbSize = this.thumb.nativeElement.clientHeight;
    this._trackMax = this.bar.nativeElement.clientHeight - this._thumbSize;
    this._currPos = this._view.scrollTop * this._trackMax / this._scrollMax;
    this._zone.run(() => {
      animationFrameScheduler.schedule(() =>
        this.updateState({
          transform: `translate3d(0, ${this._currPos}px, 0)`,
          height: `${this.thumbSize}px`
        })
      );
    });
  }

  /**
   * Start vertical thumb worker
   */
  protected startThumbEvents(): Observable<any> {
    const mouseDown$ = fromEvent(this.thumb.nativeElement, 'mousedown');
    const mouseMove$ = fromEvent(this._document, 'mousemove');
    const mouseUp$ = fromEvent(this._document, 'mouseup').pipe(
      tap(() => this._document.onselectstart = null)
    );
    return mouseDown$.pipe(
      tap(() => {
        this._document.onselectstart = () => false;
        // Initialize trackMax for before start dragging
        this._trackMax = this.bar.nativeElement.clientHeight - this._thumbSize;
      }),
      pluck('offsetY'),
      mergeMap((mouseDownOffset: number) => mouseMove$.pipe(
        takeUntil(mouseUp$),
        pluck('clientY'),
        tap((mouseMoveClient: number) => {
          const offsetY = mouseMoveClient - this.bar.nativeElement.getBoundingClientRect().top;
          const value = this._scrollMax * (offsetY - mouseDownOffset) / this._trackMax;
          this._parent.scrollable.scrollTo({top: value});
        })
      ))
    );
  }
}
