import { ElementRef } from '@angular/core';
import { getRtlScrollAxisType, Platform, RtlScrollAxisType } from '@angular/cdk/platform';
import { Directionality } from '@angular/cdk/bidi';
import { Observable, Subject } from 'rxjs';

import { ScrollbarRef } from './scrollbar-ref';
import { NgScrollbar } from '../ng-scrollbar';

export class HorizontalScrollbarRef extends ScrollbarRef {

  protected get scrollSize(): number {
    return this.viewElement.scrollWidth;
  }

  protected get viewportSize(): number {
    return this.viewElement.clientWidth;
  }

  protected get trackSize(): number {
    return this.trackElement.clientWidth;
  }

  protected get thumbSize(): number {
    return this.thumbElement.clientWidth;
  }

  protected get scrollOffset(): number {
    return this.viewElement.scrollLeft;
  }

  protected get dragOffset(): number {
    return this.trackElement.getBoundingClientRect().left;
  }

  protected get dragStartOffset(): number {
    return this.thumbElement.getBoundingClientRect().left;
  }

  protected get pageProperty(): string {
    return 'pageX';
  }

  protected get clientProperty(): string {
    return 'clientX';
  }

  constructor(protected scrollbarRef: NgScrollbar,
              protected document: any,
              trackRef: ElementRef,
              thumbRef: ElementRef,
              protected platform: Platform,
              protected destroyed: Subject<void>,
              protected dir: Directionality) {
    super(scrollbarRef, document, trackRef, thumbRef, platform, destroyed);
  }

  private _handleThumbPosition(position: number, trackMax: number) {
    if (this.dir.value === 'rtl') {
      if (this.scrollbarRef.manager.rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return -position;
      }
      if (this.scrollbarRef.manager.rtlScrollAxisType === RtlScrollAxisType.NORMAL) {
        return position - trackMax;
      }
      // Keeping this as a memo
      // if (this.rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
      //   return position;
      // }
    }
    return position;
  }

  protected handleDragPosition(position: number): number {
    if (this.dir.value === 'rtl') {
      if (this.scrollbarRef.manager.rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return position - this.scrollMax;
      }
      if (this.scrollbarRef.manager.rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return this.scrollMax - position;
      }
      // Keeping this as a memo
      // if (this.rtlScrollAxisType === RtlScrollAxisType.NORMAL) {
      //   return position;
      // }
    }
    return position;
  }

  protected scrolled(): Observable<any> {
    return this.scrollbarRef.horizontalScrolled;
  }

  protected applyThumbStyle(size: number, position: number, trackMax?: number): void {
    this.thumbElement.style.width = `${ size }px`;
    this.thumbElement.style.transform = `translate3d(${ this._handleThumbPosition(position, trackMax) }px, 0, 0)`;
  }

  protected mapToScrollToOption(value: number): ScrollToOptions {
    return { left: value };
  }

  protected scrollTo(point: number): void {
    this.viewElement.scrollLeft = point;
  }

  protected setHovered(value: boolean): void {
    this.scrollbarRef.setHovered({ horizontalHovered: value });
  }

  protected setDragging(value: boolean): void {
    this.scrollbarRef.setDragging({ horizontalDragging: value });
  }
}
