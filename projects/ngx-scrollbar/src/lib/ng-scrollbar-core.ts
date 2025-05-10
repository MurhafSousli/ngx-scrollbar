import {
  Directive,
  inject,
  signal,
  computed,
  untracked,
  afterRenderEffect,
  NgZone,
  Signal,
  ElementRef,
  WritableSignal,
  EffectCleanupRegisterFn,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, Subscription } from 'rxjs';
import {
  SmoothScrollElement,
  SmoothScrollManager,
  SmoothScrollToElementOptions,
  SmoothScrollToOptions
} from 'ngx-scrollbar/smooth-scroll';
import { _NgScrollbar } from './utils/scrollbar-base';
import { ViewportAdapter } from './viewport';
import { ElementDimension, ScrollbarDragging, getThrottledStream } from './utils/common';
import { ScrollbarOrientation, ScrollbarUpdateReason, ScrollbarVisibility } from './ng-scrollbar.model';
import { Core } from './core';

interface ViewportState {
  verticalUsed: boolean,
  horizontalUsed: boolean,
  isVerticallyScrollable: boolean,
  isHorizontallyScrollable: boolean,
}

@Directive({
  host: {
    '[class.ng-scroll-viewport]': 'true',
    '[attr.verticalUsed]': 'verticalUsed()',
    '[attr.horizontalUsed]': 'horizontalUsed()',
    '[attr.isVerticallyScrollable]': 'isVerticallyScrollable()',
    '[attr.isHorizontallyScrollable]': 'isHorizontallyScrollable()',
    '[attr.mobile]': 'isMobile',
    '[attr.dir]': 'direction()',
    '[attr.position]': 'position()',
    '[attr.dragging]': 'dragging()',
    '[attr.appearance]': 'appearance()',
    '[attr.visibility]': 'visibility()',
    '[attr.orientation]': 'orientation()',
    '[attr.disableInteraction]': 'disableInteraction()',
    '[style.--content-height]': 'contentDimension().height',
    '[style.--content-width]': 'contentDimension().width',
    '[style.--viewport-height]': 'viewportDimension().height',
    '[style.--viewport-width]': 'viewportDimension().width'
  }
})
export class NgScrollbarCore extends Core implements _NgScrollbar {

  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  private readonly zone: NgZone = inject(NgZone);

  private readonly platform: Platform = inject(Platform);

  /** A flag that indicates if the platform is mobile */
  readonly isMobile: boolean = this.platform.IOS || this.platform.ANDROID;

  readonly dir: Directionality = inject(Directionality);

  readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  /** Viewport adapter instance */
  readonly viewport: ViewportAdapter = inject(ViewportAdapter);

  /** Viewport native element */
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  /**
   * Indicates if the direction is 'ltr' or 'rtl'
   */
  direction: Signal<Direction> = toSignal<Direction, Direction>(this.dir.change, { initialValue: this.dir.value });

  /**
   * Indicates when scrollbar thumb is being dragged
   */
  dragging: WritableSignal<ScrollbarDragging> = signal('none');

  /** Viewport dimension */
  viewportDimension: WritableSignal<ElementDimension> = signal<ElementDimension>({ width: 0, height: 0 });

  /** Content dimension */
  contentDimension: WritableSignal<ElementDimension> = signal<ElementDimension>({ width: 0, height: 0 });

  private state: Signal<ViewportState> = computed(() => {
    let verticalUsed: boolean = false;
    let horizontalUsed: boolean = false;
    let isVerticallyScrollable: boolean = false;
    let isHorizontallyScrollable: boolean = false;

    const orientation: ScrollbarOrientation = this.orientation();
    const visibility: ScrollbarVisibility = this.visibility();

    const viewportDimensions: ElementDimension = this.viewportDimension();
    const contentDimensions: ElementDimension = this.contentDimension();

    // Check if the vertical scrollbar should be displayed
    if (orientation === 'auto' || orientation === 'vertical') {
      isVerticallyScrollable = contentDimensions.height > viewportDimensions.height;
      verticalUsed = visibility === 'visible' || isVerticallyScrollable;
    }
    // Check if the horizontal scrollbar should be displayed
    if (orientation === 'auto' || orientation === 'horizontal') {
      isHorizontallyScrollable = contentDimensions.width > viewportDimensions.width;
      horizontalUsed = visibility === 'visible' || isHorizontallyScrollable;
    }

    return {
      verticalUsed,
      horizontalUsed,
      isVerticallyScrollable,
      isHorizontallyScrollable,
    };
  });

  isVerticallyScrollable: Signal<boolean> = computed(() => this.state().isVerticallyScrollable);
  isHorizontallyScrollable: Signal<boolean> = computed(() => this.state().isHorizontallyScrollable);
  verticalUsed: Signal<boolean> = computed(() => this.state().verticalUsed);
  horizontalUsed: Signal<boolean> = computed(() => this.state().horizontalUsed);

  protected constructor() {
    super();
    let resizeSub$: Subscription;
    let hasInitialized: boolean;

    afterRenderEffect({
      earlyRead: (onCleanup: EffectCleanupRegisterFn): void => {
        const disableSensor: boolean = this.disableSensor();
        const throttleDuration: number = this.sensorThrottleTime();
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
                      this.afterUpdate.emit();
                    } else {
                      this.afterInit.emit();
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
      this.afterInit.emit();
    } else {
      this.afterUpdate.emit();
    }
  }

  /**
   * Smooth scroll functions
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.viewport.nativeElement, options);
  }

  /**
   * Scroll to an element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport.nativeElement, target, options);
  }

  private updateDimensions(): void {
    this.viewportDimension.set({ width: this.viewport.offsetWidth, height: this.viewport.offsetHeight });
    this.contentDimension.set({ width: this.viewport.contentWidth, height: this.viewport.contentHeight });
  }
}
