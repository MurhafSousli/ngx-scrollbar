import { Directive, inject, effect, untracked, contentChild, Signal } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgScrollbarExt } from 'ngx-scrollbar';

@Directive({
  standalone: true,
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
          const viewport: HTMLElement = virtualScrollViewport.elementRef.nativeElement;
          const contentWrapper: HTMLElement = virtualScrollViewport._contentWrapper.nativeElement;
          const spacer: HTMLElement = virtualScrollViewport.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-spacer');

          this.scrollbar.initialize(viewport, contentWrapper, spacer);
        }
      });
    });
  }
}
