import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[customScrollView], [custom-scroll-view]',
  host: {
    '[class.ng-custom-scroll-view]': 'true',
  }
})
export class CustomScrollView {
  constructor(public viewPort: ElementRef) {
  }
}
