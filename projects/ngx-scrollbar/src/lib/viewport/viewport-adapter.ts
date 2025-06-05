import {
  Directive,
  inject,
  signal,
  computed,
  Signal,
  WritableSignal
} from '@angular/core';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SmoothScrollElement,
  SmoothScrollManager,
  SmoothScrollToOptions,
  SmoothScrollToElementOptions
} from 'ngx-scrollbar/smooth-scroll';
import { ScrollbarVisibility, ScrollbarOrientation } from '../ng-scrollbar.model';
import { ElementDimension, ScrollbarDragging, ViewportClasses } from '../utils/common';
import { ScrollbarInputOutputs } from './scrollbar-input-outputs';

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
export class ViewportAdapter extends ScrollbarInputOutputs {

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
  viewportElement: HTMLElement;
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
  get clientHeight(): number {
    return this.viewportElement.clientHeight;
  }

  /** Viewport clientWidth */
  get clientWidth(): number {
    return this.viewportElement.clientWidth;
  }

  /** Viewport scrollTop */
  get scrollTop(): number {
    return this.viewportElement.scrollTop;
  }

  /** Viewport scrollLeft */
  get scrollLeft(): number {
    return this.viewportElement.scrollLeft;
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
    return this.contentWidth - this.clientWidth;
  }

  /** The vertical remaining scrollable distance */
  get scrollMaxY(): number {
    return this.contentHeight - this.clientHeight;
  }

  /**
   * Initialize viewport
   */
  init(viewportElement: HTMLElement, contentElement: HTMLElement, spacerElement?: HTMLElement): void {
    this.viewportElement = viewportElement;

    // When integrating the scrollbar with virtual scroll, the content wrapper will have fake size,
    // and a spacer element will have the real size
    // Therefore, if spaceElement is provided, it will be observed instead of the content wrapper
    if (spacerElement) {
      spacerElement.classList.add(ViewportClasses.Spacer);
      this.contentWrapperElement = spacerElement;
    } else {
      this.contentWrapperElement = contentElement;
    }
    this.initialized.set(true);
  }

  reset(): void {
    this.viewportElement = null;
    this.contentWrapperElement = null;
    this.initialized.set(false);
  }

  /**
   * Scrolls the viewport vertically to the specified value.
   */
  scrollYTo(value: number): void {
    this.viewportElement.scrollTop = value;
  }

  /**
   * Scrolls the viewport horizontally to the specified value.
   */
  scrollXTo(value: number): void {
    this.viewportElement.scrollLeft = value;
  }


  /**
   * Smooth scroll functions
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.viewportElement, options);
  }

  /**
   * Scroll to an element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewportElement, target, options);
  }

}
