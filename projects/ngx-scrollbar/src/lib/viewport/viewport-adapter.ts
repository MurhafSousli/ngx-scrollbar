import {
  Directive,
  inject,
  signal,
  output,
  computed,
  numberAttribute,
  booleanAttribute,
  input,
  Signal,
  InputSignal,
  WritableSignal,
  OutputEmitterRef,
  InputSignalWithTransform
} from '@angular/core';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SmoothScrollElement,
  SmoothScrollManager,
  SmoothScrollToOptions,
  SmoothScrollToElementOptions
} from 'ngx-scrollbar/smooth-scroll';
import {
  NG_SCROLLBAR_OPTIONS,
  ScrollbarPosition,
  NgScrollbarOptions,
  ScrollbarVisibility,
  ScrollbarAppearance,
  ScrollbarOrientation
} from '../ng-scrollbar.model';
import { ElementDimension, ScrollbarDragging, ViewportClasses } from '../utils/common';

interface ViewportState {
  verticalUsed: boolean,
  horizontalUsed: boolean,
  isVerticallyScrollable: boolean,
  isHorizontallyScrollable: boolean,
}

const INITIAL_DIMENSION_VALUE: ElementDimension = { width: 0, height: 0 };

/**
 * Class representing a viewport adapter.
 * Provides methods and properties to interact with a viewport and its content.
 */
@Directive()
export class ViewportAdapter {

  /** Global options */
  private readonly options: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS);

  readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  readonly dir: Directionality = inject(Directionality);

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
  sensorThrottleTime: InputSignalWithTransform<number, string | number> = input<number, string | number>(this.options.sensorThrottleTime, {
    transform: numberAttribute
  });

  /** A flag used to activate hover effect on the offset area around the scrollbar */
  hoverOffset: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.hoverOffset, {
    transform: booleanAttribute
  });

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

  /** Viewport dimension */
  viewportDimension: WritableSignal<ElementDimension> = signal<ElementDimension>(INITIAL_DIMENSION_VALUE);

  /** Content dimension */
  contentDimension: WritableSignal<ElementDimension> = signal<ElementDimension>(INITIAL_DIMENSION_VALUE);

  /**
   * Viewport native element
   */
  nativeElement: HTMLElement;
  /**
   * The element that wraps the content inside the viewport,
   * used to measure the content size and observe its changes.
   */
  contentWrapperElement: HTMLElement;

  /*
   * A signal that indicates when viewport adapter is initialized
   */
  initialized: WritableSignal<boolean> = signal(false);

  /** Viewport clientHeight */
  get offsetHeight(): number {
    return this.nativeElement.clientHeight;
  }

  /** Viewport clientWidth */
  get offsetWidth(): number {
    return this.nativeElement.clientWidth;
  }

  /** Viewport scrollTop */
  get scrollTop(): number {
    return this.nativeElement.scrollTop;
  }

  /** Viewport scrollLeft */
  get scrollLeft(): number {
    return this.nativeElement.scrollLeft;
  }

  /** Content height */
  get contentHeight(): number {
    return this.contentWrapperElement.clientHeight;
  }

  /** Content width */
  get contentWidth(): number {
    return this.contentWrapperElement.clientWidth;
  }

  /** The remaining vertical scrollable distance. */
  get scrollMaxX(): number {
    return this.contentWidth - this.offsetWidth;
  }

  /** The vertical remaining scrollable distance */
  get scrollMaxY(): number {
    return this.contentHeight - this.offsetHeight;
  }

  /**
   * Initialize viewport
   */
  init(viewportElement: HTMLElement, contentElement: HTMLElement, spacerElement?: HTMLElement): void {
    // Add viewport class
    viewportElement.classList.add(ViewportClasses.Viewport);
    this.nativeElement = viewportElement;

    // When integrating the scrollbar with virtual scroll, the content wrapper will have fake size,
    // and a spacer element will have the real size
    // Therefore, if spaceElement is provided, it will be observed instead of the content wrapper
    if (spacerElement) {
      spacerElement.classList.add(ViewportClasses.Spacer);
     this.contentWrapperElement = spacerElement;
    } else {
      // If spacer is not provided, set it as the content wrapper
      this.contentWrapperElement = contentElement;
    }
    this.initialized.set(true);
  }

  reset(): void {
    this.nativeElement = null;
    this.contentWrapperElement = null;
    this.initialized.set(false);
  }

  /**
   * Scrolls the viewport vertically to the specified value.
   */
  scrollYTo(value: number): void {
    this.nativeElement.scrollTop = value;
  }

  /**
   * Scrolls the viewport horizontally to the specified value.
   */
  scrollXTo(value: number): void {
    this.nativeElement.scrollLeft = value;
  }


  /**
   * Smooth scroll functions
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.nativeElement, options);
  }

  /**
   * Scroll to an element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.nativeElement, target, options);
  }

}
