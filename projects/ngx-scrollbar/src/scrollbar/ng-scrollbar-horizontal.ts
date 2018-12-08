import { Component, Inject, NgZone, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable, animationFrameScheduler } from 'rxjs';
import { mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarThumb } from './ng-scrollbar-thumb';

@Component({
  selector: 'ng-scrollbar-horizontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #bar class="ng-scrollbar ng-scrollbar-horizontal {{barClass}}" (mousedown)="onScrollbarHolderClick($event)">
      <div #thumb class="ng-scrollbar-thumb {{thumbClass}}" [ngStyle]="scrollbarStyle | async"></div>
    </div>
  `
})
export class NgScrollbarHorizontal extends NgScrollbarThumb {

  /**
   * Calculate scrollbar thumbnail size
   */
  get thumbSize(): number {
    const barClientWidth = this.bar.nativeElement.clientWidth;
    const viewClientWidth = this._view.clientWidth;
    const viewScrollWidth = this._view.scrollWidth;
    this._naturalThumbSize = barClientWidth / viewScrollWidth * barClientWidth;
    this._scrollMax = viewScrollWidth - viewClientWidth;
    return this.scrollBoundaries(this._naturalThumbSize, this._scrollMax);
  }

  constructor(@Inject(DOCUMENT) protected _document: any,
              @Inject(forwardRef(() => NgScrollbar)) protected _parent: NgScrollbar,
              protected _zone: NgZone) {
    super(_parent, _zone);
  }

  /**
   * Scrollbar click
   * @param e Mouse event
   */
  onScrollbarHolderClick(e: any) {
    if (e.target === e.currentTarget) {
      const offsetX = e.offsetX - this._naturalThumbSize * .5;
      const thumbPositionPercentage = offsetX * 100 / this.bar.nativeElement.clientWidth;
      const value = thumbPositionPercentage * this._view.scrollWidth / 100;
      this._parent.scrollTo({left: value, duration: this.scrollToDuration} as any).subscribe();
    }
  }

  /**
   * Update scrollbar
   */
  protected updateScrollbar() {
    this._thumbSize = this.thumb.nativeElement.clientWidth;
    this._trackMax = this.bar.nativeElement.clientWidth - this._thumbSize;
    this._currPos = this._view.scrollLeft * this._trackMax / this._scrollMax;
    this._zone.run(() =>
      animationFrameScheduler.schedule(() =>
        this.updateState({
          transform: `translate3d(${this._currPos}px, 0, 0)`,
          width: `${this.thumbSize}px`
        })
      )
    );
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
        this._trackMax = this.bar.nativeElement.clientWidth - this._thumbSize;
      }),
      pluck('offsetX'),
      mergeMap((mouseDownOffset: number) => mouseMove$.pipe(
        takeUntil(mouseUp$),
        pluck('clientX'),
        tap((mouseMoveClient: number) => {
          const offsetX = mouseMoveClient - this.bar.nativeElement.getBoundingClientRect().left;
          const value = this._scrollMax * (offsetX - mouseDownOffset) / this._trackMax;
          this._parent.scrollable.scrollTo({left: value});
        })
      ))
    );
  }
}
