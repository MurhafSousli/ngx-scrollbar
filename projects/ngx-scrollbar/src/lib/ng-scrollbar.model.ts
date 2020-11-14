import { InjectionToken } from '@angular/core';

export type ScrollbarAppearance = 'standard' | 'compact';
export type ScrollbarTrack = 'vertical' | 'horizontal' | 'all';
export type ScrollbarVisibility = 'hover' | 'always' | 'native';
export type ScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll';
export type ScrollbarPointerEventsMethod = 'viewport' | 'scrollbar';

export const NG_SCROLLBAR_OPTIONS = new InjectionToken<NgScrollbarOptions>('NG_SCROLLBAR_OPTIONS');

export type NgScrollbarOptions = Partial<IScrollbarOptions>;

/**
 * The following interface is meant to be used internally to ensure that the properties are not undefined (for strict mode)
 */
export interface IScrollbarOptions {
  /**
   * Sets the scroll axis of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar-control
   * - `horizontal` Use both vertical and horizontal scrollbar-control
   * - `all` Use both vertical and horizontal scrollbar-control
   */
  track: ScrollbarTrack;
  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar-control
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  visibility: ScrollbarVisibility;
  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `standard` (default) scrollbar space will be reserved just like with native scrollbar-control.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  appearance: ScrollbarAppearance;
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar-control.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar-control positions
   */
  position: ScrollbarPosition;
  /**
   * Sets the pointer events method
   * Use viewport pointer events  to handle dragging and track click (This makes scrolling work when mouse is over the scrollbar)
   * Use scrollbar pointer events to handle dragging and track click
   */
  pointerEventsMethod: ScrollbarPointerEventsMethod;
  /** A class forwarded to scrollable viewport element */
  viewClass: string;
  /** A class forwarded to the scrollbar track element */
  trackClass: string;
  /** A class forwarded to the scrollbar thumb element */
  thumbClass: string;
  /** The minimum scrollbar thumb size in px */
  minThumbSize: number;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  trackClickScrollDuration: number;
  /** A flag used to enable/disable the scrollbar pointer events */
  pointerEventsDisabled: boolean;
  /** Debounce interval for detecting changes via window.resize event */
  windowResizeDebounce: number;
  /** Debounce interval for detecting changes via ResizeObserver */
  sensorDebounce: number;
  /** Whether ResizeObserver is disabled */
  sensorDisabled: boolean;
  /** Disable auto-height */
  autoHeightDisabled: boolean;
  /** Disable auto-width */
  autoWidthDisabled: boolean;
  /** Scroll Audit Time */
  scrollAuditTime: number;
  /** Enable viewport mousemove event propagation (only when pointerEventsMethod="viewport") */
  viewportPropagateMouseMove: boolean;
}

/**
 * Set of attributes added on the scrollbar wrapper
 */
export interface NgScrollbarState {
  position?: ScrollbarPosition;
  track?: ScrollbarTrack;
  appearance?: ScrollbarAppearance;
  visibility?: ScrollbarVisibility;
  deactivated?: boolean;
  pointerEventsMethod?: ScrollbarPointerEventsMethod;
  dir?: 'rtl' | 'ltr';
  verticalUsed?: boolean;
  horizontalUsed?: boolean;
  isVerticallyScrollable?: boolean;
  isHorizontallyScrollable?: boolean;
  verticalHovered?: boolean;
  horizontalHovered?: boolean;
  verticalDragging?: boolean;
  horizontalDragging?: boolean;
  // Flag used to prevent text selection on content
  scrollbarClicked?: boolean;
}
