import { Directive, inject } from '@angular/core';
import { NgScrollbarExt } from 'ngx-scrollbar';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[cdkVirtualScrollViewport]'
})
export class NgScrollbarCdkVirtualScroll {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt);

  constructor() {
    this.scrollbar.externalViewport = '.cdk-virtual-scroll-viewport';
    this.scrollbar.externalContentWrapper = '.cdk-virtual-scroll-content-wrapper';
    this.scrollbar.externalSpacer = '.cdk-virtual-scroll-spacer';
  }
}
