import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollViewport], [scroll-viewport]',
  host: {
    '[class.ng-scroll-viewport]': 'true'
  }
})
export class ScrollViewport {
  constructor(public viewPort: ElementRef) {
  }
}
