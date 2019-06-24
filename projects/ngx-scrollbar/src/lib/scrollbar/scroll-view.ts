import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollView], [scroll-view]',
  host: {
    '[class.ng-custom-scroll-view]': 'true',
  }
})
export class ScrollView {
  constructor(public viewPort: ElementRef) {
  }
}
