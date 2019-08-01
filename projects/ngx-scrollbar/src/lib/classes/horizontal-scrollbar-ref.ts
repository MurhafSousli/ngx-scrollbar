import { ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
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

  protected scrolled(): Observable<any> {
    return this.scrollbarRef.horizontalScrolled;
  }

  protected applyThumbStyle(size: number, position: number, trackMax?: number): void {
    this.thumbElement.style.width = `${ size }px`;
    let value = 0;
    if (this.dir.value === 'rtl') {
      if (this.platform.FIREFOX) {
        value = position;
      } else if (this.platform.EDGE) {
        value = -position;
      } else {
        value = position - trackMax;
      }
    } else {
      value = position;
    }
    this.thumbElement.style.transform = `translate3d(${ value }px, 0, 0)`;
  }

  protected mapToScrollToOption(value: number): ScrollToOptions {
    return { left: value };
  }

  protected handleDragBrowserCompatibility(position: number): number {
    if (this.dir.value === 'rtl') {
      if (this.platform.FIREFOX) {
        return position - this.scrollMax;
      }
      if (this.platform.EDGE) {
        return this.scrollMax - position;
      }
      return position;
    }
    return position;
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
