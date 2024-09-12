import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  EffectCleanupRegisterFn,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  NgZone,
  numberAttribute,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  untracked,
  WritableSignal
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, Observable, Subscription, tap } from 'rxjs';
import {
  SmoothScrollElement,
  SmoothScrollManager,
  SmoothScrollToElementOptions,
  SmoothScrollToOptions
} from 'ngx-scrollbar/smooth-scroll';
import { Scrollbars } from './scrollbars/scrollbars';
import { _NgScrollbar, NG_SCROLLBAR } from './utils/scrollbar-base';
import { ViewportAdapter } from './viewport';
import { ElementDimension, filterResizeEntries, getThrottledStream, ScrollbarDragging } from './utils/common';
import {
  NG_SCROLLBAR_OPTIONS,
  NgScrollbarOptions,
  ScrollbarAppearance,
  ScrollbarOrientation,
  ScrollbarPosition,
  ScrollbarUpdateReason,
  ScrollbarVisibility
} from './ng-scrollbar.model';

interface ViewportState {
  verticalUsed: boolean,
  horizontalUsed: boolean,
  isVerticallyScrollable: boolean,
  isHorizontallyScrollable: boolean,
}

const initialDimension: ElementDimension = { width: 0, height: 0 };

@Directive({
  host: {
    '[class.ng-scrollbar]': 'true',
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
    '[attr.disableInteraction]': 'disableInteraction()'
  },
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbarCore }
  ]
})
export abstract class NgScrollbarCore implements _NgScrollbar {

  /** Global options */
  private readonly options: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS);

  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  private readonly zone: NgZone = inject(NgZone);

  private readonly platform: Platform = inject(Platform);

  /** A flag that indicates if the platform is mobile */
  readonly isMobile: boolean = this.platform.IOS || this.platform.ANDROID;

  readonly dir: Directionality = inject(Directionality);

  readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  /** Viewport adapter instance */
  readonly viewport: ViewportAdapter = inject(ViewportAdapter, { self: true });

  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  /**
   * Indicates if the direction is 'ltr' or 'rtl'
   */
  direction: Signal<Direction> = toSignal<Direction, Direction>(this.dir.change, { initialValue: this.dir.value });

  /**
   * Indicates when scrollbar thumb is being dragged
   */
  dragging: WritableSignal<ScrollbarDragging> = signal('none');

  /**
   * Sets the supported scroll track of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar
   * - `horizontal` Use both vertical and horizontal scrollbar
   * - `auto` Use both vertical and horizontal scrollbar
   */
  orientation: InputSignal<ScrollbarOrientation> = input<ScrollbarOrientation>(this.options.orientation);

  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  visibility: InputSignal<ScrollbarVisibility> = input<ScrollbarVisibility>(this.options.visibility);

  /** Show scrollbar buttons */
  buttons: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.buttons, {
    transform: booleanAttribute
  });

  /** Disables scrollbar interaction like dragging thumb and jumping by track click */
  disableInteraction: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableInteraction, {
    transform: booleanAttribute
  });

  /** Whether ResizeObserver is disabled */
  disableSensor: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableSensor, {
    transform: booleanAttribute
  });

  /** Throttle interval for detecting changes via ResizeObserver */
  sensorThrottleTime: InputSignal<number> = input<number, number>(this.options.sensorThrottleTime, {
    transform: numberAttribute
  });

  /** A flag used to activate hover effect on the offset area around the scrollbar */
  hoverOffset: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.hoverOffset, {
    transform: booleanAttribute
  });

  viewportDimension: WritableSignal<ElementDimension> = signal(initialDimension);
  contentDimension: WritableSignal<ElementDimension> = signal(initialDimension);

  private state: Signal<ViewportState> = computed(() => {
    let verticalUsed: boolean = false;
    let horizontalUsed: boolean = false;
    let isVerticallyScrollable: boolean = false;
    let isHorizontallyScrollable: boolean = false;

    const orientation: ScrollbarOrientation = this.orientation();
    const visibility: ScrollbarVisibility = this.visibility();

    const viewportDimensions: ElementDimension = this.viewportDimension();
    const contentDimensions: ElementDimension = this.contentDimension();

    // Check if vertical scrollbar should be displayed
    if (orientation === 'auto' || orientation === 'vertical') {
      isVerticallyScrollable = contentDimensions.height > viewportDimensions.height;
      verticalUsed = visibility === 'visible' || isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
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

  /** Scroll duration when the scroll track is clicked */
  trackScrollDuration: InputSignalWithTransform<number, string | number> = input<number, string | number>(this.options.trackScrollDuration, {
    transform: numberAttribute
  });

  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `native` (default) scrollbar space will be reserved just like with native scrollbar.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  appearance: InputSignal<ScrollbarAppearance> = input<ScrollbarAppearance>(this.options.appearance);
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar positions
   */
  position: InputSignal<ScrollbarPosition> = input<ScrollbarPosition>(this.options.position);

  /** A class forwarded to the scrollbar track element */
  trackClass: InputSignal<string> = input<string>(this.options.trackClass);
  /** A class forwarded to the scrollbar thumb element */
  thumbClass: InputSignal<string> = input<string>(this.options.thumbClass);
  /** A class forwarded to the scrollbar button element */
  buttonClass: InputSignal<string> = input<string>(this.options.thumbClass);

  /** Steam that emits when scrollbar is initialized */
  afterInit: OutputEmitterRef<void> = output<void>();

  /** Steam that emits when scrollbar is updated */
  afterUpdate: OutputEmitterRef<void> = output<void>();

  /** The scrollbars component instance used for testing purpose */
  abstract _scrollbars: Signal<Scrollbars>;

  protected constructor() {
    const viewportDimensions: ElementDimension = { ...initialDimension };
    const contentDimensions: ElementDimension = { ...initialDimension };

    let resizeSub$: Subscription;
    let hasInitialized: boolean;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const disableSensor: boolean = this.disableSensor();
      const throttleDuration: number = this.sensorThrottleTime();
      const viewportInit: boolean = this.viewport.initialized();

      untracked(() => {
        if (viewportInit) {
          if (disableSensor) {
            this.update(ScrollbarUpdateReason.AfterInit);
          } else {
            this.zone.runOutsideAngular(() => {
              const viewportSizeChange$: Observable<DOMRectReadOnly> = this.sharedResizeObserver.observe(this.viewport.nativeElement).pipe(
                map((entries: ResizeObserverEntry[]) => filterResizeEntries(entries, this.viewport.nativeElement)),
                tap((rect: DOMRectReadOnly) => this.updateDimensions(rect, viewportDimensions, 'viewport'))
              );
              const contentSizeChange$: Observable<DOMRectReadOnly> = this.sharedResizeObserver.observe(this.viewport.contentWrapperElement).pipe(
                map((entries: ResizeObserverEntry[]) => filterResizeEntries(entries, this.viewport.contentWrapperElement)),
                tap((rect: DOMRectReadOnly) => this.updateDimensions(rect, contentDimensions, 'content'))
              );

              resizeSub$ = combineLatest([
                getThrottledStream(viewportSizeChange$, throttleDuration),
                getThrottledStream(contentSizeChange$, throttleDuration)
              ]).subscribe(() => {
                this.zone.run(() => {
                  this.viewportDimension.set({ ...viewportDimensions });
                  this.contentDimension.set({ ...contentDimensions });

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
    });
  }

  /**
   * Update local state and the internal scrollbar controls
   */
  update(reason?: ScrollbarUpdateReason): void {
    const viewRect: DOMRect = this.viewport.nativeElement.getBoundingClientRect();
    this.viewportDimension.set({ height: viewRect.height, width: viewRect.width });
    const contentRect: DOMRect = this.viewport.contentWrapperElement.getBoundingClientRect();
    this.contentDimension.set({ height: contentRect.height, width: contentRect.width });

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
   * Scroll to element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport.nativeElement, target, options);
  }

  private updateDimensions(rect: DOMRectReadOnly, dimensions: ElementDimension, prefix: string): void {
    this.nativeElement.style.setProperty(`--${ prefix }-width`, `${ rect.width }`);
    this.nativeElement.style.setProperty(`--${ prefix }-height`, `${ rect.height }`);
    dimensions.width = rect.width;
    dimensions.height = rect.height;
  }
}

