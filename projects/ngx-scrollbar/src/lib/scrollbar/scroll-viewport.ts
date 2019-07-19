import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollViewport], [scroll-viewport]',
  host: {
    '[class.ng-custom-scroll-view]': 'true',
    '[class.active-scroll-viewport]': 'true'
  }
})
export class ScrollViewport {
  constructor(public viewPort: ElementRef) {
  }
}
