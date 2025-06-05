import {
  Directive,
  inject,
  untracked,
  afterRenderEffect,
  NgZone,
  ElementRef,
  EffectCleanupRegisterFn
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { combineLatest, SubscriptionLike } from 'rxjs';
import { ViewportAdapter } from './viewport';
import { getThrottledStream } from './utils/common';
import { ScrollbarUpdateReason } from './ng-scrollbar.model';

@Directive({
  host: {
    '[class.ng-scroll-viewport]': 'true',
    '[attr.mobile]': 'isMobile',
    '[attr.dir]': 'adapter.direction()',
    '[attr.dragging]': 'adapter.dragging()',
    '[attr.position]': 'adapter.position()',
    '[attr.appearance]': 'adapter.appearance()',
    '[attr.visibility]': 'adapter.visibility()',
    '[attr.orientation]': 'adapter.orientation()',
    '[attr.disableInteraction]': 'adapter.disableInteraction()',
    '[attr.verticalUsed]': 'adapter.verticalUsed()',
    '[attr.horizontalUsed]': 'adapter.horizontalUsed()',
    '[attr.isVerticallyScrollable]': 'adapter.isVerticallyScrollable()',
    '[attr.isHorizontallyScrollable]': 'adapter.isHorizontallyScrollable()',
    '[style.--content-height]': 'adapter.contentDimension().height',
    '[style.--content-width]': 'adapter.contentDimension().width',
    '[style.--viewport-height]': 'adapter.viewportDimension().height',
    '[style.--viewport-width]': 'adapter.viewportDimension().width'
  }
})
export class NgScrollbarCore {

  private readonly zone: NgZone = inject(NgZone);

  private readonly platform: Platform = inject(Platform);

  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  /** Viewport adapter instance */
  readonly adapter: ViewportAdapter = inject(ViewportAdapter);

  /** Viewport native element */
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  /** A flag that indicates if the platform is mobile */
  readonly isMobile: boolean = this.platform.IOS || this.platform.ANDROID;

  protected constructor() {
    let resizeSub$: SubscriptionLike;
    let hasInitialized: boolean;

    afterRenderEffect({
      earlyRead: (onCleanup: EffectCleanupRegisterFn): void => {
        const disableSensor: boolean = this.adapter.disableSensor();
        const throttleDuration: number = this.adapter.sensorThrottleTime();
        const viewportInit: boolean = this.adapter.initialized();

        untracked(() => {
          if (viewportInit) {
            // If resize sensor is disabled, update manually the first time
            if (disableSensor) {
              requestAnimationFrame(() => this.update(ScrollbarUpdateReason.AfterInit));
            } else {
              // Observe size changes for viewport and content wrapper
              this.zone.runOutsideAngular(() => {
                resizeSub$ = getThrottledStream(
                  combineLatest([
                    this.sharedResizeObserver.observe(this.adapter.viewportElement),
                    this.sharedResizeObserver.observe(this.adapter.contentWrapperElement)
                  ]),
                  throttleDuration
                ).subscribe(() => {
                  // After deep investigation, it appears that setting the dimension directly from the element properties
                  // is much faster than to set them from resize callback values
                  this.zone.run(() => {
                    this.updateDimensions();

                    if (hasInitialized) {
                      this.adapter.afterUpdate.emit();
                    } else {
                      this.adapter.afterInit.emit();
                    }
                    hasInitialized = true;
                  });
                });
              });
            }
          }

          onCleanup(() => resizeSub$?.unsubscribe());
        });
      }
    });
  }

  /**
   * Manual update
   */
  update(reason?: ScrollbarUpdateReason): void {
    this.updateDimensions();

    if (reason === ScrollbarUpdateReason.AfterInit) {
      this.adapter.afterInit.emit();
    } else {
      this.adapter.afterUpdate.emit();
    }
  }

  private updateDimensions(): void {
    this.adapter.viewportDimension.set({ width: this.adapter.clientWidth, height: this.adapter.clientHeight });
    this.adapter.contentDimension.set({ width: this.adapter.contentWidth, height: this.adapter.contentHeight });
  }
}
