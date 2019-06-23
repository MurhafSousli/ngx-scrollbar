import { Directive, ElementRef } from '@angular/core';
import { SmoothScrollEaseFunc, SmoothScrollManager, SmoothScrollToOptions } from './smooth-scroll-manager';

@Directive({
  selector: '[smoothScroll], [smooth-scroll]',
  exportAs: 'smoothScroll'
})
export class SmoothScroll {

  private readonly view: HTMLElement;

  constructor(el: ElementRef, private smoothScroll: SmoothScrollManager) {
    this.view = el.nativeElement;
  }

  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.view, options);
  }

  scrollToElement(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToElement(this.view, selector, offset, duration, easeFunc);
  }

  scrollXTo(left: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollXTo(this.view, left, duration, easeFunc);
  }

  scrollYTo(top: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollYTo(this.view, top, duration, easeFunc);
  }

  scrollToTop(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToTop(this.view, duration, easeFunc);
  }

  scrollToBottom(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToBottom(this.view, duration, easeFunc);
  }

  scrollToRight(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToRight(this.view, duration, easeFunc);
  }

  scrollToLeft(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToLeft(this.view, duration, easeFunc);
  }
}
