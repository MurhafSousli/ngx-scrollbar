import {
  Directive,
  inject,
  untracked,
  afterRenderEffect,
  NgZone,
  ElementRef,
  EffectCleanupRegisterFn,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { combineLatest, Subscription } from 'rxjs';
import { ViewportAdapter } from './viewport';
import { getThrottledStream } from './utils/common';
import { ScrollbarUpdateReason } from './ng-scrollbar.model';

@Directive({
  host: {
    '[class.ng-scroll-viewport]': 'true',
    '[attr.mobile]': 'isMobile',
    '[attr.dir]': 'viewport.direction()',
    '[attr.dragging]': 'viewport.dragging()',
    '[attr.verticalUsed]': 'viewport.verticalUsed()',
    '[attr.horizontalUsed]': 'viewport.horizontalUsed()',
    '[attr.isVerticallyScrollable]': 'viewport.isVerticallyScrollable()',
    '[attr.isHorizontallyScrollable]': 'viewport.isHorizontallyScrollable()',
    '[style.--content-height]': 'viewport.contentDimension().height',
    '[style.--content-width]': 'viewport.contentDimension().width',
    '[style.--viewport-height]': 'viewport.viewportDimension().height',
    '[style.--viewport-width]': 'viewport.viewportDimension().width',
    '[attr.position]': 'viewport.position()',
    '[attr.appearance]': 'viewport.appearance()',
    '[attr.visibility]': 'viewport.visibility()',
    '[attr.orientation]': 'viewport.orientation()',
    '[attr.disableInteraction]': 'viewport.disableInteraction()'
  }
})
export class NgScrollbarCore {

  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  private readonly zone: NgZone = inject(NgZone);

  private readonly platform: Platform = inject(Platform);

  /** A flag that indicates if the platform is mobile */
  readonly isMobile: boolean = this.platform.IOS || this.platform.ANDROID;

  /** Viewport adapter instance */
  readonly viewport: ViewportAdapter = inject(ViewportAdapter);

  /** Viewport native element */
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  protected constructor() {
    let resizeSub$: Subscription;
    let hasInitialized: boolean;

    afterRenderEffect({
      earlyRead: (onCleanup: EffectCleanupRegisterFn): void => {
        const disableSensor: boolean = this.viewport.disableSensor();
        const throttleDuration: number = this.viewport.sensorThrottleTime();
        const viewportInit: boolean = this.viewport.initialized();

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
                    this.sharedResizeObserver.observe(this.viewport.nativeElement),
                    this.sharedResizeObserver.observe(this.viewport.contentWrapperElement)
                  ]),
                  throttleDuration
                ).subscribe(() => {
                  // After deep investigation, it appears that setting the dimension directly from the element properties
                  // is much faster than to set them from resize callback values
                  this.zone.run(() => {
                    this.updateDimensions();

                    if (hasInitialized) {
                      this.viewport.afterUpdate.emit();
                    } else {
                      this.viewport.afterInit.emit();
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
      this.viewport.afterInit.emit();
    } else {
      this.viewport.afterUpdate.emit();
    }
  }

  private updateDimensions(): void {
    this.viewport.viewportDimension.set({ width: this.viewport.offsetWidth, height: this.viewport.offsetHeight });
    this.viewport.contentDimension.set({ width: this.viewport.contentWidth, height: this.viewport.contentHeight });
  }
}
