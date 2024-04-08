import {
  Directive,
  Input,
  inject,
  effect,
  contentChild,
  Signal,
  EffectCleanupRegisterFn
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgScrollbarExt } from 'ngx-scrollbar';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[cdkVirtualScrollViewport]'
})
export class NgScrollbarCdkVirtualScroll {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt);

  private readonly virtualScrollViewportRef: Signal<CdkVirtualScrollViewport> = contentChild(CdkVirtualScrollViewport);

  @Input() cdkVirtualScrollViewport: '' | 'auto';

  constructor() {
    this.scrollbar.externalViewport = '.cdk-virtual-scroll-viewport';
    this.scrollbar.externalContentWrapper = '.cdk-virtual-scroll-content-wrapper';
    this.scrollbar.externalSpacer = '.cdk-virtual-scroll-spacer';

    effect((onCleanup: EffectCleanupRegisterFn) => {
      // If content width is bigger than the viewport, we need to update the spacer width to display horizontal scrollbar
      let resizeObserver: ResizeObserver;
      const virtualScrollViewport: CdkVirtualScrollViewport = this.virtualScrollViewportRef();

      const spacer: HTMLElement = virtualScrollViewport.elementRef.nativeElement.querySelector(this.scrollbar.externalSpacer);

      if (virtualScrollViewport) {
        resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
          entries.forEach((entry: ResizeObserverEntry) => {
            if (virtualScrollViewport.orientation === 'vertical') {
              spacer.style.setProperty('width', `${ entry.contentRect.width }px`);
            } else {
              spacer.style.setProperty('height', `${ entry.contentRect.height }px`);
            }
          });

          // Disconnect after first change if directive is not set to auto
          if (this.cdkVirtualScrollViewport !== 'auto') {
            resizeObserver.disconnect();
          }
          // Observe content wrapper for size changes
          resizeObserver.observe(virtualScrollViewport._contentWrapper.nativeElement);
        });
      }

      onCleanup(() => resizeObserver.disconnect());
    });
  }
}
