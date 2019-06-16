import { Directive, ElementRef, Optional } from '@angular/core';
import { SmoothScroll } from '../smooth-scroll/smooth-scroll';

@Directive({
  selector: '[customScrollView], [custom-scroll-view]',
  host: {
    '[class.ng-custom-scroll-view]': 'true',
  }
})
export class CustomScrollView {

  constructor(
    public viewPort: ElementRef,
    @Optional() public smoothScroll: SmoothScroll
  ) {
    if (!smoothScroll) {
      throw new Error('NgScrollBar: add [smoothScroll] directive is required with [VirtualScrollView]');
    }
  }
}
