import { ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable, Subject } from 'rxjs';

import { ScrollbarRef } from './scrollbar-ref';
import { NgScrollbar } from '../ng-scrollbar';

export class VerticalScrollbarRef extends ScrollbarRef {

  protected get scrollSize(): number {
    return this.viewElement.scrollHeight;
  }

  protected get viewportSize(): number {
    return this.viewElement.clientHeight;
  }

  protected get trackSize(): number {
    return this.trackElement.clientHeight;
  }

  protected get thumbSize(): number {
    return this.thumbElement.clientHeight;
  }

  protected get scrollOffset(): number {
    return this.viewElement.scrollTop;
  }

  protected get dragOffset(): number {
    return this.trackElement.getBoundingClientRect().top;
  }

  protected get offsetProperty(): string {
    return 'offsetY';
  }

  protected get clientProperty(): string {
    return 'clientY';
  }

  constructor(protected scrollbarRef: NgScrollbar,
              protected document: any,
              trackRef: ElementRef,
              thumbRef: ElementRef,
              platform: Platform,
              protected destroyed: Subject<void>) {
    super(scrollbarRef, document, trackRef, thumbRef, platform, destroyed);
  }

  protected scrolled(): Observable<any> {
    return this.scrollbarRef.verticalScrolled;
  }

  protected applyThumbStyle(size: number, position: number): void {
    this.thumbElement.style.height = `${ size }px`;
    this.thumbElement.style.transform = `translate3d(0 ,${ position }px, 0)`;
  }

  protected mapToScrollToOption(value: number): ScrollToOptions {
    return { top: value };
  }

  protected handleDragBrowserCompatibility(position: number): number {
    return position;
  }

  protected scrollTo(point: number): void {
    this.viewElement.scrollTop = point;
  }
}

