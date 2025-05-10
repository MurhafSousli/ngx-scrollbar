import { Directive, inject, effect, untracked, contentChild, Signal } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgScrollbarExt } from 'ngx-scrollbar';

@Directive({
  selector: 'ng-scrollbar[cdkVirtualScrollViewport]'
})
export class NgScrollbarCdkVirtualScroll {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  private readonly virtualScrollViewportRef: Signal<CdkVirtualScrollViewport> = contentChild(CdkVirtualScrollViewport);

  constructor() {
    this.scrollbar.skipInit = true;

    // Since 'effects' runs before 'afterNextRender' and our elements are defined, will use 'effects'.
    effect(() => {
      const virtualScrollViewport: CdkVirtualScrollViewport = this.virtualScrollViewportRef();

      untracked(() => {
        if (virtualScrollViewport) {
          this.scrollbar.viewportElement.set(virtualScrollViewport.elementRef.nativeElement);
          this.scrollbar.contentWrapperElement.set(virtualScrollViewport._contentWrapper.nativeElement);
          this.scrollbar.spacerElement.set(virtualScrollViewport.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-spacer'));

          this.scrollbar.initialize(
            this.scrollbar.viewportElement(),
            this.scrollbar.contentWrapperElement(),
            this.scrollbar.spacerElement()
          );
        }
      });
    });
  }
}
