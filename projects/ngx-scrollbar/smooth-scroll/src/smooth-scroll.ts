import { Directive, ElementRef } from '@angular/core';
import { SmoothScrollEaseFunc, SmoothScrollManager, SmoothScrollToOptions } from './smooth-scroll-manager';

@Directive({
  selector: '[smoothScroll], [smooth-scroll]',
  exportAs: 'smoothScroll'
})
export class SmoothScroll {

  constructor(private element: ElementRef, private smoothScroll: SmoothScrollManager) {
  }

  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.element, options);
  }

  scrollToElement(target: HTMLElement | ElementRef<HTMLElement>,
                  offset = 0,
                  duration?: number,
                  easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToElement(this.element, target, offset, duration, easeFunc);
  }

  scrollToSelector(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToSelector(this.element, selector, offset, duration, easeFunc);
  }

  scrollToTop(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToTop(this.element, offset, duration, easeFunc);
  }

  scrollToBottom(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToBottom(this.element, offset, duration, easeFunc);
  }

  scrollToRight(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToRight(this.element, offset, duration, easeFunc);
  }

  scrollToLeft(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToLeft(this.element, offset, duration, easeFunc);
  }
}
