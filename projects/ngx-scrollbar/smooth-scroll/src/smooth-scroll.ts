import { Directive, ElementRef, inject } from '@angular/core';
import { SmoothScrollManager } from './smooth-scroll-manager';
import { SmoothScrollElement, SmoothScrollToElementOptions, SmoothScrollToOptions } from './smooth-scroll.model';

@Directive({
  standalone: true,
  selector: '[smoothScroll]',
  exportAs: 'smoothScroll'
})
export class SmoothScroll {

  private readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  private readonly element: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.element, options);
  }

  scrollToElement(target: SmoothScrollElement, options: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.element, target, options);
  }
}
