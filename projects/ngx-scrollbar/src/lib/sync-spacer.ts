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
import { Subscription, map } from 'rxjs';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { filterResizeEntries } from './ng-scrollbar.model';
import { ElementDimension, getThrottledStream } from './utils/common';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport][syncSpacer]',
  host: {
    '[style.--spacer-width]': 'spacerDimension().width',
    '[style.--spacer-height]': 'spacerDimension().height'
  }
})
export class SyncSpacer {

  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  private readonly zone: NgZone = inject(NgZone);

  /**
   * A signal used to sync spacer dimension when content dimension changes
   */
  spacerDimension: WritableSignal<ElementDimension> = signal({});

  constructor() {
    let sub$: Subscription;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const spacerElement: HTMLElement = this.scrollbar.spacerElement();
      const contentWrapperElement: HTMLElement = this.scrollbar.contentWrapperElement();
      const throttleDuration: number = this.scrollbar.sensorThrottleTime();
      const disableSensor: boolean = this.scrollbar.disableSensor();

      untracked(() => {
        if (!disableSensor && contentWrapperElement && spacerElement) {
          // Sync spacer dimension with content wrapper dimensions to allow both scrollbars to be displayed
          this.zone.runOutsideAngular(() => {
            sub$ = getThrottledStream(this.sharedResizeObserver.observe(contentWrapperElement), throttleDuration).pipe(
              map((entries: ResizeObserverEntry[]) => filterResizeEntries(entries, contentWrapperElement)),
            ).subscribe(() => {
              this.zone.run(() => {
                // Use animation frame to avoid "ResizeObserver loop completed with undelivered notifications." error
                requestAnimationFrame(() => {
                  this.spacerDimension.set({
                    width: contentWrapperElement.offsetWidth,
                    height: contentWrapperElement.offsetHeight
                  });
                });
              });
            });
          });
        }
        onCleanup(() => sub$?.unsubscribe())
      });
    });
  }
}
