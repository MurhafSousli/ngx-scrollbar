import { Directive, Optional } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SmoothScroll } from '../smooth-scroll';

@Directive({
  selector: '[virtualScrollView]',
  host: {
    '[class.ng-virtual-scroll-view]': 'true',
  }
})
export class VirtualScrollView {

  constructor(
    @Optional() public virtualScrollViewport: CdkVirtualScrollViewport,
    @Optional() public smoothScroll: SmoothScroll
  ) {
    if (!virtualScrollViewport) {
      throw new Error('NgScrollBar: add [virtualScrollView] directive on CdkVirtualScrollViewport component only');
    }
    if (!smoothScroll) {
      throw new Error('NgScrollBar: add [smoothScroll] directive is required with [VirtualScrollView]');
    }
  }
}
