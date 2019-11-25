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

  scrollTo(options: SmoothScrollToOptions): Promise<void> | undefined {
    return this.smoothScroll.scrollTo(this.element, options);
  }

  scrollToElement(target: SmoothScrollElement, options: SmoothScrollOptions): Promise<void> | undefined {
    return this.smoothScroll.scrollToElement(this.element, target, options);
  }
}
