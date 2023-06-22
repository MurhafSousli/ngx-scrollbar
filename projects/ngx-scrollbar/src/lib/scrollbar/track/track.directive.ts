import { Directive, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TrackAdapter } from './track';
import { NgScrollbarBase } from '../../ng-scrollbar-base';

@Directive({
  selector: '[scrollbarTrackX]',
  standalone: true
})
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

  constructor(protected cmp: NgScrollbarBase, trackElement: ElementRef, @Inject(DOCUMENT) protected document: Document) {
    super(cmp, trackElement.nativeElement, document);
  }

  protected mapToScrollToOption(value: number): ScrollToOptions {
    return { left: value };
  }
}

@Directive({
  selector: '[scrollbarTrackY]',
  standalone: true
})
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

  constructor(protected cmp: NgScrollbarBase, trackElement: ElementRef, @Inject(DOCUMENT) protected document: Document) {
    super(cmp, trackElement.nativeElement, document);
  }

  protected mapToScrollToOption(value: number): ScrollToOptions {
    return { top: value };
  }
}
