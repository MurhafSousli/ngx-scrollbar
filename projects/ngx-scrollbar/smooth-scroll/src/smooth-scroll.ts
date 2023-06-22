import { Directive, ElementRef } from '@angular/core';
import { SmoothScrollManager } from './smooth-scroll-manager';
import { SmoothScrollElement, SmoothScrollToElementOptions, SmoothScrollToOptions } from './smooth-scroll.model';

@Directive({
  selector: '[smoothScroll], [smooth-scroll]',
  exportAs: 'smoothScroll',
  standalone: true
})
export class SmoothScroll {

  constructor(private element: ElementRef, private smoothScroll: SmoothScrollManager) {
  }

  scrollTo(options: SmoothScrollToOptions): Promise<void> | undefined {
    return this.smoothScroll.scrollTo(this.element, options);
  }

  scrollToElement(target: SmoothScrollElement, options: SmoothScrollToElementOptions): Promise<void> | undefined {
    return this.smoothScroll.scrollToElement(this.element, target, options);
  }
}
