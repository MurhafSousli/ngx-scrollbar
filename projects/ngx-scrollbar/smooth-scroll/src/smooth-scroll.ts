import { Directive, ElementRef } from '@angular/core';
import { SmoothScrollManager } from './smooth-scroll-manager';
import { SmoothScrollElement, SmoothScrollOptions, SmoothScrollToOptions } from './smooth-scroll.model';

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

  scrollToElement(target: SmoothScrollElement, options: SmoothScrollOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.element, target, options);
  }

  scrollToTop(options): Promise<void> {
    return this.smoothScroll.scrollToTop(this.element, options);
  }

  scrollToBottom(options): Promise<void> {
    return this.smoothScroll.scrollToBottom(this.element, options);
  }

  scrollToRight(options): Promise<void> {
    return this.smoothScroll.scrollToRight(this.element, options);
  }

  scrollToLeft(options): Promise<void> {
    return this.smoothScroll.scrollToLeft(this.element, options);
  }
}
