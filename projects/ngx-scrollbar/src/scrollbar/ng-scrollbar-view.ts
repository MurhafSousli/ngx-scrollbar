import {Directive, Optional} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {SmoothScroll} from '../smooth-scroll/smooth-scroll';

@Directive({
  selector: '[ngScrollbarView]',
  host: {
    '[class.ng-custom-scroll-view]': 'true'
  }
})
export class NgScrollbarView {

  constructor(@Optional() public virtualScrollViewport: CdkVirtualScrollViewport,
              @Optional() public smoothScroll: SmoothScroll) {
    if (!virtualScrollViewport) {
      throw new Error('NgScrollBar: add [NgScrollbarView] directive on CdkVirtualScrollViewport component only');
    }
    if (!smoothScroll) {
      throw new Error('NgScrollBar: add [smoothScroll] directive is required with [NgScrollbarView]');
    }
  }
}
