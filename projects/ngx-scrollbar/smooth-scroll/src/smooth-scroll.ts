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

  scrollToElement(target: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToElement(this.view, target, offset, duration, easeFunc);
  }

  scrollToSelector(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToSelector(this.view, selector, offset, duration, easeFunc);
  }

  scrollToTop(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToTop(this.view, offset, duration, easeFunc);
  }

  scrollToBottom(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToBottom(this.view, offset, duration, easeFunc);
  }

  scrollToRight(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToRight(this.view, offset, duration, easeFunc);
  }

  scrollToLeft(offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToLeft(this.view, offset, duration, easeFunc);
  }
}
