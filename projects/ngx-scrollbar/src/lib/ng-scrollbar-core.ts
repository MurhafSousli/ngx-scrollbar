import {
  Directive,
  Input,
  Output,
  inject,
  signal,
  effect,
  computed,
  numberAttribute,
  booleanAttribute,
  runInInjectionContext,
  input,
  EventEmitter,
  OnInit,
  AfterViewInit,
  ElementRef,
  NgZone,
  Signal,
  InputSignal,
  Injector,
  WritableSignal,
  EffectCleanupRegisterFn,
  InputSignalWithTransform
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription, map, tap } from 'rxjs';
import {
  SmoothScrollElement,
  SmoothScrollManager,
  SmoothScrollToElementOptions,
  SmoothScrollToOptions
} from 'ngx-scrollbar/smooth-scroll';
import { Scrollbars } from './scrollbars/scrollbars';
import { _NgScrollbar, NG_SCROLLBAR } from './utils/scrollbar-base';
import { resizeObserver, ViewportAdapter } from './viewport';
import { ScrollbarDragging, ViewportBoundaries } from './utils/common';
import {
  ScrollbarAppearance,
  ScrollbarPosition,
  ScrollbarOrientation,
  ScrollbarUpdateReason,
  ScrollbarVisibility,
  NgScrollbarOptions,
  NG_SCROLLBAR_OPTIONS
} from './ng-scrollbar.model';

const defaultOptions: NgScrollbarOptions = {
  trackClass: '',
  thumbClass: '',
  orientation: 'auto',
  appearance: 'native',
  visibility: 'native',
  position: 'native',
  trackScrollDuration: 50,
  sensorThrottleTime: 0,
  disableSensor: false,
  disableInteraction: false
};

interface ViewportState {
  verticalUsed: boolean,
  horizontalUsed: boolean,
  isVerticallyScrollable: boolean,
  isHorizontallyScrollable: boolean,
}

@Directive({
  host: {
    '[class.ng-scrollbar]': 'true',
    '[attr.verticalUsed]': 'verticalUsed()',
    '[attr.horizontalUsed]': 'horizontalUsed()',
    '[attr.isVerticallyScrollable]': 'isVerticallyScrollable()',
    '[attr.isHorizontallyScrollable]': 'isHorizontallyScrollable()',
    '[attr.mobile]': 'isMobile',
    '[attr.dir]': 'direction()',
    '[attr.position]': 'position',
    '[attr.dragging]': 'dragging()',
    '[attr.appearance]': 'appearance',
    '[attr.visibility]': 'visibility()',
    '[attr.orientation]': 'orientation()',
    '[attr.disableInteraction]': 'disableInteraction()'
  },
  providers: [{ provide: NG_SCROLLBAR, useExisting: NgScrollbarCore }]
})
export abstract class NgScrollbarCore implements _NgScrollbar, OnInit, AfterViewInit {

  /** Injected options */
  private readonly injectedOptions: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS, { optional: true });

  /** Combine injected option with default options */
  private readonly options: NgScrollbarOptions = this.injectedOptions ? { ...defaultOptions, ...this.injectedOptions } : defaultOptions;

  private readonly zone: NgZone = inject(NgZone);
  private readonly platform: Platform = inject(Platform);
  private readonly injector: Injector = inject(Injector);

  /** A flag that indicates if the platform is mobile */
  readonly isMobile: boolean = this.platform.IOS || this.platform.ANDROID;
  dir: Directionality = inject(Directionality);

  smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  /**
   * Indicates if the direction is 'ltr' or 'rtl'
   */
  direction: Signal<Direction>;

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

  viewportDimension: WritableSignal<ViewportBoundaries> = signal({
    contentHeight: 0,
    contentWidth: 0,
    offsetHeight: 0,
    offsetWidth: 0
  });

  state: Signal<ViewportState> = computed(() => {
    let verticalUsed: boolean = false;
    let horizontalUsed: boolean = false;
    let isVerticallyScrollable: boolean = false;
    let isHorizontallyScrollable: boolean = false;

    const orientation: ScrollbarOrientation = this.orientation();
    const visibility: ScrollbarVisibility = this.visibility();
    const viewport: ViewportBoundaries = this.viewportDimension();

    // Check if vertical scrollbar should be displayed
    if (orientation === 'auto' || orientation === 'vertical') {
      isVerticallyScrollable = viewport.contentHeight > viewport.offsetHeight;
      verticalUsed = visibility === 'visible' || isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
    if (orientation === 'auto' || orientation === 'horizontal') {
      isHorizontallyScrollable = viewport.contentWidth > viewport.offsetWidth;
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
  @Input({ transform: numberAttribute }) trackScrollDuration: number = this.options.trackScrollDuration;

  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `standard` (default) scrollbar space will be reserved just like with native scrollbar.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  @Input() appearance: ScrollbarAppearance = this.options.appearance;
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar positions
   */
  @Input() position: ScrollbarPosition = this.options.position;

  /** A class forwarded to the scrollbar track element */
  @Input() trackClass: string = this.options.trackClass;
  /** A class forwarded to the scrollbar thumb element */
  @Input() thumbClass: string = this.options.thumbClass;

  /** Steam that emits when scrollbar is initialized */
  @Output() afterInit: EventEmitter<void> = new EventEmitter<void>();

  /** Steam that emits when scrollbar is updated */
  @Output() afterUpdate: EventEmitter<void> = new EventEmitter<void>();

  /** Resize observer subscription */
  private sizeChangeSub: Subscription;

  /** Viewport adapter instance */
  viewport: ViewportAdapter = new ViewportAdapter();

  /** The scrollbars component instance used for testing purpose */
  abstract _scrollbars: Scrollbars;

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      // The direction signal cannot be initialized in the constructor
      // Because it initially returns 'ltr' even if dir.value is 'rtl`
      this.direction = toSignal<Direction, Direction>(this.dir.change.pipe(map(() => this.dir.value)), { initialValue: this.dir.value });

      effect((onCleanup: EffectCleanupRegisterFn) => {
        // Check whether sensor should be enabled
        if (this.disableSensor()) {
          // If sensor is disabled update manually
          this.sizeChangeSub?.unsubscribe();
        } else {
          if (this.platform.isBrowser && this.viewport.initialized()) {
            this.sizeChangeSub?.unsubscribe();

            this.zone.runOutsideAngular(() => {
              this.sizeChangeSub = resizeObserver({
                element: this.viewport.nativeElement,
                contentWrapper: this.viewport.contentWrapperElement,
                throttleDuration: this.sensorThrottleTime()
              }).pipe(
                tap((reason: ScrollbarUpdateReason) => this.update(reason))
              ).subscribe();
            });
          }
        }

        onCleanup(() => this.sizeChangeSub?.unsubscribe());
      });
    });
  }

  ngAfterViewInit(): void {
    // If sensor is disabled, update to evaluate the state
    if (this.platform.isBrowser && this.disableSensor()) {
      // In case of 3rd party library, need to wait for content to be rendered
      requestAnimationFrame(() => {
        this.update(ScrollbarUpdateReason.AfterInit);
      });
    }
  }

  /**
   * Update local state and the internal scrollbar controls
   */
  update(reason?: ScrollbarUpdateReason): void {
    this.updateCSSVariables();

    this.zone.run(() => {
      this.viewportDimension.set({
        contentHeight: this.viewport.contentHeight,
        contentWidth: this.viewport.contentWidth,
        offsetHeight: this.viewport.offsetHeight,
        offsetWidth: this.viewport.offsetWidth
      });

      if (reason === ScrollbarUpdateReason.AfterInit) {
        this.afterInit.emit();
      } else {
        this.afterUpdate.emit();
      }
    });
  }

  /**
   * Smooth scroll functions
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.viewport!.nativeElement, options);
  }

  /**
   * Scroll to element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport.nativeElement, target, options);
  }

  /**
   * Update Essential CSS variables
   */
  private updateCSSVariables(): void {
    this.nativeElement.style.setProperty('--content-height', `${ this.viewport.contentHeight }`);
    this.nativeElement.style.setProperty('--content-width', `${ this.viewport.contentWidth }`);
    this.nativeElement.style.setProperty('--viewport-height', `${ this.viewport.offsetHeight }`);
    this.nativeElement.style.setProperty('--viewport-width', `${ this.viewport.offsetWidth }`);
  }
}
