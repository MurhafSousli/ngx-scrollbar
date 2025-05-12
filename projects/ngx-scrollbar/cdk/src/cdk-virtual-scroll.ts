import { Directive, inject, effect, untracked, Signal, contentChild } from '@angular/core';
import { CdkVirtualScrollableElement, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgScrollbarExt } from 'ngx-scrollbar';

@Directive({
  selector: 'ng-scrollbar[externalViewport][cdkVirtualScrollViewport]'
})
export class NgScrollbarCdkVirtualScroll {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  private readonly virtualScrollViewportRef: Signal<CdkVirtualScrollViewport> = contentChild(CdkVirtualScrollViewport);

  private readonly virtualScrollableElement: Signal<CdkVirtualScrollableElement> = contentChild(CdkVirtualScrollableElement);

  constructor() {
    this.scrollbar.skipInit = true;

    // Since 'effects' runs before 'afterNextRender' and our elements are defined, will use 'effects'.
    effect(() => {
      const virtualScrollViewport: CdkVirtualScrollViewport = this.virtualScrollViewportRef();
      if (!virtualScrollViewport) {
        console.error('The [CdkVirtualScrollViewport] component was not found!');
        return;
      }

      untracked(() => {
        const viewport: HTMLElement = virtualScrollViewport.scrollable.getElementRef().nativeElement;

        let contentWrapper: HTMLElement;
        let spacer: HTMLElement;
        if (!this.virtualScrollableElement()) {
          contentWrapper = virtualScrollViewport._contentWrapper.nativeElement;
          spacer = virtualScrollViewport.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-spacer');
        }

        this.scrollbar.initialize(viewport, contentWrapper, spacer);
      });
    });
  }
}
