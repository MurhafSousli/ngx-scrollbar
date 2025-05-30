import {
  Directive,
  inject,
  signal,
  effect,
  untracked,
  NgZone,
  WritableSignal,
  EffectCleanupRegisterFn
} from '@angular/core';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { SubscriptionLike } from 'rxjs';
import { ViewportAdapter } from './viewport';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { ElementDimension, getThrottledStream } from './utils/common';

@Directive({
  selector: 'ng-scrollbar[externalViewport][syncSpacer]',
  host: {
    '[style.--spacer-width]': 'spacerDimension().width',
    '[style.--spacer-height]': 'spacerDimension().height'
  }
})
export class NgSyncSpacer {

  private readonly zone: NgZone = inject(NgZone);

  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  private readonly viewport: ViewportAdapter = inject(ViewportAdapter, { self: true });

  /**
   * A signal used to sync spacer dimension when content dimension changes
   */
  spacerDimension: WritableSignal<ElementDimension> = signal<ElementDimension>({});

  constructor() {
    let resizeSub$: SubscriptionLike;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const throttleDuration: number = this.viewport.sensorThrottleTime();
      const disableSensor: boolean = this.viewport.disableSensor();
      const contentWrapperElement: HTMLElement = this.scrollbar.contentWrapperElement();
      const spacerElement: HTMLElement = this.scrollbar.spacerElement();

      untracked(() => {
        if (!disableSensor && contentWrapperElement && spacerElement) {
          // Sync spacer dimension with content wrapper dimensions to allow both scrollbars to be displayed
          this.zone.runOutsideAngular(() => {
            resizeSub$ = getThrottledStream(this.sharedResizeObserver.observe(contentWrapperElement), throttleDuration).subscribe(() => {
              this.zone.run(() => {
                // Use animation frame to avoid "ResizeObserver loop completed with undelivered notifications." error
                requestAnimationFrame(() => {
                  this.spacerDimension.set({
                    width: contentWrapperElement.offsetWidth,
                    height: contentWrapperElement.offsetHeight
                  });
                })
              });
            });
          });
        }
        onCleanup(() => resizeSub$?.unsubscribe());
      });
    });
  }
}
