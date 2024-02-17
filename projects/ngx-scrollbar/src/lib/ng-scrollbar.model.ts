import { InjectionToken } from '@angular/core';

export type ScrollbarAppearance = 'standard' | 'compact';
export type ScrollbarOrientation = 'auto' | 'vertical' | 'horizontal';
export type ScrollbarVisibility = 'hover' | 'always' | 'native';
export type ScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll';
export type ScrollbarDragging = 'x' | 'y' | 'none';

export enum ScrollbarUpdateReason {
  AfterInit = 'AfterInit',
  Resized = 'ResizeObserver'
}

export const NG_SCROLLBAR_OPTIONS: InjectionToken<NgScrollbarOptions> = new InjectionToken<NgScrollbarOptions>('NG_SCROLLBAR_OPTIONS');

export interface NgScrollbarOptions {
  /**
   * Sets the scroll timeline polyfill
   */
  scrollTimelinePolyfill?: string;
  /**
   * Sets the scroll axis of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar-control
   * - `horizontal` Use both vertical and horizontal scrollbar-control
   * - `all` Use both vertical and horizontal scrollbar-control
   */
  orientation?: ScrollbarOrientation;
  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar-control
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  visibility?: ScrollbarVisibility;
  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `standard` (default) scrollbar space will be reserved just like with native scrollbar-control.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  appearance?: ScrollbarAppearance;
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar-control.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar-control positions
   */
  position?: ScrollbarPosition;
  /** A class forwarded to the scrollbar track element */
  trackClass?: string;
  /** A class forwarded to the scrollbar thumb element */
  thumbClass?: string;
  /** Scrolling speed when clicking on scrollbar rail */
  clickScrollDuration?: number;
  /** A flag used to enable/disable the scrollbar pointer events */
  disableInteraction?: boolean;
  /** Debounce interval for detecting changes via ResizeObserver */
  sensorThrottleTime?: number;
  /** Whether ResizeObserver is disabled */
  disableSensor?: boolean;
}

export enum ViewportClasses {
  Viewport = 'ng-scroll-viewport',
  Content = 'ng-scroll-content'
}

export interface ViewportBoundaries {
  contentHeight: number;
  contentWidth: number;
  offsetHeight: number;
  offsetWidth: number;
}
