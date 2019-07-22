import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollViewport], [scroll-viewport]',
  host: {
    '[class.ng-custom-scroll-viewport]': 'true',
    '[attr.active-viewport]': 'true'
  }
})
export class ScrollViewport {
  constructor(public viewPort: ElementRef) {
  }
}
