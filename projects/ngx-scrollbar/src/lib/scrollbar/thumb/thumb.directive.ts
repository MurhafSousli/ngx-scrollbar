import { Directive, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RtlScrollAxisType } from '@angular/cdk/platform';
import { Directionality } from '@angular/cdk/bidi';
import { ThumbAdapter } from './thumb';
import { TrackXDirective, TrackYDirective } from '../track/track.directive';
import { NgScrollbarBase } from '../../ng-scrollbar-base';

@Directive({
  selector: '[scrollbarThumbX]',
  standalone: true
})
export class ThumbXDirective extends ThumbAdapter {

  protected get clientProperty(): string {
    return 'clientX';
  }

  protected get pageProperty(): string {
    return 'pageX';
  }

  protected get viewportScrollSize(): number {
    return this.cmp.viewport!.scrollWidth;
  }

  protected get viewportScrollOffset(): number {
    return this.cmp.viewport!.scrollLeft;
  }

  get viewportScrollMax(): number {
    return this.cmp.viewport!.scrollMaxX;
  }

  get dragStartOffset(): number {
    return this.clientRect.left + this.document.defaultView!.pageXOffset || 0;
  }

  get size(): number {
    return this.thumbElement.clientWidth;
  }

  constructor(protected cmp: NgScrollbarBase,
              protected track: TrackXDirective,
              protected element: ElementRef,
              @Inject(DOCUMENT) protected document: Document,
              protected dir: Directionality) {
    super(cmp, track, element.nativeElement, document);
  }

  protected updateStyles(position: number, size: number) {
    this.thumbElement.style.width = `${ size }px`;
    this.thumbElement.style.transform = `translate3d(${ position }px, 0, 0)`;
  }

  protected handleDrag(position: number, scrollMax: number): number {
    if (this.dir.value === 'rtl') {
      if (this.cmp.manager.rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return position - scrollMax;
      }
      if (this.cmp.manager.rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return scrollMax - position;
      }
      // Keeping this as a memo
      // if (this.rtlScrollAxisType === RtlScrollAxisType.NORMAL) {
      //   return position;
      // }
    }
    return position;
  }

  protected handleDirection(position: number, trackMax: number): number {
    if (this.dir.value === 'rtl') {
      if (this.cmp.manager.rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return -position;
      }
      if (this.cmp.manager.rtlScrollAxisType === RtlScrollAxisType.NORMAL) {
        return position - trackMax;
      }
      // Keeping this as a memo
      // if (this.rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
      //   return position;
      // }
    }
    return position;
  }

  protected setDragging(value: boolean): void {
    this.cmp.setDragging({ horizontalDragging: value });
  }

  protected scrollTo(position: number): void {
    this.cmp.viewport!.scrollXTo(position);
  }
}

@Directive({
  selector: '[scrollbarThumbY]',
  standalone: true
})
export class ThumbYDirective extends ThumbAdapter {

  protected get pageProperty(): string {
    return 'pageY';
  }

  protected get viewportScrollSize(): number {
    return this.cmp.viewport!.scrollHeight;
  }

  protected get viewportScrollOffset(): number {
    return this.cmp.viewport!.scrollTop;
  }

  get viewportScrollMax(): number {
    return this.cmp.viewport!.scrollMaxY;
  }

  protected get clientProperty(): string {
    return 'clientY';
  }

  get dragStartOffset(): number {
    return this.clientRect.top + this.document.defaultView!.pageYOffset || 0;
  }

  get size(): number {
    return this.thumbElement.clientHeight;
  }

  constructor(protected cmp: NgScrollbarBase,
              protected track: TrackYDirective,
              protected element: ElementRef,
              @Inject(DOCUMENT) protected document: Document) {
    super(cmp, track, element.nativeElement, document);
  }


  protected updateStyles(position: number, size: number): void {
    this.thumbElement.style.height = `${ size }px`;
    this.thumbElement.style.transform = `translate3d(0px, ${ position }px, 0)`;
  }

  protected handleDrag(position: number): number {
    return position;
  }

  protected handleDirection(position: number): number {
    return position;
  }

  protected setDragging(value: boolean): void {
    this.cmp.setDragging({ verticalDragging: value });
  }

  protected scrollTo(position: number): void {
    this.cmp.viewport!.scrollYTo(position);
  }
}
