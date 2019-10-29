import { Directive, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TrackAdapter } from './track';
import { NgScrollbar } from '../../ng-scrollbar';

@Directive({ selector: '[scrollbarTrackX]' })
export class TrackXDirective extends TrackAdapter {

  get pageProperty(): string {
    return 'pageX';
  }

  get offset(): number {
    return this.clientRect.left;
  }

  get size(): number {
    return this.trackElement.clientWidth;
  }

  constructor(protected cmp: NgScrollbar, trackElement: ElementRef, @Inject(DOCUMENT) protected document: any) {
    super(cmp, trackElement.nativeElement, document);
  }

  protected mapToScrollToOption(value: number): ScrollToOptions {
    return { left: value };
  }
}

@Directive({ selector: '[scrollbarTrackY]' })
export class TrackYDirective extends TrackAdapter {

  get pageProperty(): string {
    return 'pageY';
  }

  get offset(): number {
    return this.clientRect.top;
  }

  get size(): number {
    return this.trackElement.clientHeight;
  }

  constructor(protected cmp: NgScrollbar, trackElement: ElementRef, @Inject(DOCUMENT) protected document: any) {
    super(cmp, trackElement.nativeElement, document);
  }

  protected mapToScrollToOption(value: number): ScrollToOptions {
    return { top: value };
  }
}
