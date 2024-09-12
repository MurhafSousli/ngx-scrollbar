import {
  Directive,
  Input,
  inject,
  effect,
  untracked,
  contentChild,
  Signal,
  EffectCleanupRegisterFn
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgScrollbarExt } from 'ngx-scrollbar';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[cdkVirtualScrollViewport]'
})
export class NgScrollbarCdkVirtualScroll {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  private readonly platform: Platform = inject(Platform);

  private readonly virtualScrollViewportRef: Signal<CdkVirtualScrollViewport> = contentChild(CdkVirtualScrollViewport);

  @Input() cdkVirtualScrollViewport: '' | 'auto';

  constructor() {
    this.scrollbar.skipInit = true;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const virtualScrollViewport: CdkVirtualScrollViewport = this.virtualScrollViewportRef();

      untracked(() => {
        // If content width is bigger than the viewport, we need to update the spacer width to display horizontal scrollbar
        let resizeObserver: ResizeObserver;

        if (virtualScrollViewport) {
          const viewport: HTMLElement = virtualScrollViewport.elementRef.nativeElement;
          const contentWrapper: HTMLElement = virtualScrollViewport._contentWrapper.nativeElement;
          const spacer: HTMLElement = virtualScrollViewport.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-spacer');

          this.scrollbar.skipInit = false;
          this.scrollbar.altViewport.set(viewport);
          this.scrollbar.altContentWrapper.set(contentWrapper);
          this.scrollbar.altSpacer.set(spacer);

          // TODO: Check if we can get rid of isBrowser here
          if (this.platform.isBrowser && virtualScrollViewport) {
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
        }

        onCleanup(() => resizeObserver?.disconnect());
      });
    });
  }
}
