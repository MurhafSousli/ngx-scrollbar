import { InjectionToken } from '@angular/core';

export type ScrollbarAppearance = 'native' | 'compact';
export type ScrollbarOrientation = 'auto' | 'vertical' | 'horizontal';
export type ScrollbarVisibility = 'native' | 'hover' | 'visible';
export type ScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll';

export enum ScrollbarUpdateReason {
  AfterInit = 'AfterInit',
  Resized = 'ResizeObserver'
}

export const NG_SCROLLBAR_OPTIONS: InjectionToken<NgScrollbarOptions> = new InjectionToken<NgScrollbarOptions>('NG_SCROLLBAR_OPTIONS');

export const NG_SCROLLBAR_POLYFILL: InjectionToken<string> = new InjectionToken<string>('NG_SCROLLBAR_POLYFILL');

export interface NgScrollbarOptions {
  /**
   * Sets the scroll axis of the viewport.
   * - 'auto': Scrollbars are displayed for both vertical and horizontal scrolling.
   * - 'vertical': Scrollbars are displayed for vertical scrolling.
   * - 'horizontal': Scrollbars are displayed for horizontal scrolling.
   * Defaults to 'auto'.
   */
  orientation?: ScrollbarOrientation;

  /**
   * Determines when to show the scrollbar.
   * - 'native': Scrollbar is visible when the viewport is scrollable, similar to native scrollbars.
   * - 'hover': Scrollbars are hidden by default and become visible on scrolling or hovering.
   * - 'visible': Scrollbars are always visible, even if the viewport is not scrollable.
   * Defaults to 'native'.
   */
  visibility?: ScrollbarVisibility;

  /**
   * Sets the appearance of the scrollbar.
   * - 'native': Scrollbar space is reserved within the viewport, similar to native scrollbars.
   * - 'compact': Scrollbars do not reserve any space and are placed over the viewport.
   * Defaults to 'native'.
   */
  appearance?: ScrollbarAppearance;

  /**
   * Sets the position of each scrollbar.
   * - 'native': Uses the default position as in native scrollbars.
   * - 'invertY': Inverts the vertical scrollbar position.
   * - 'invertX': Inverts the horizontal scrollbar position.
   * - 'invertAll': Inverts the positions of both vertical and horizontal scrollbars.
   * Defaults to 'native'.
   */
  position?: ScrollbarPosition;
  /** A class forwarded to the scrollbar track element */
  trackClass?: string;
  /** A class forwarded to the scrollbar thumb element */
  thumbClass?: string;
  /** A class forwarded to the scrollbar button element */
  buttonClass?: string;
  /** Scrolling speed when clicking on scrollbar rail */
  trackScrollDuration?: number;
  /** A flag used to enable/disable the scrollbar pointer events */
  disableInteraction?: boolean;
  /** Debounce interval for detecting changes via ResizeObserver */
  sensorThrottleTime?: number;
  /** Whether ResizeObserver is disabled */
  disableSensor?: boolean;
  /** Show scrollbar buttons */
  buttons?: boolean;
  /** A flag used to activate hover effect on the offset area around the scrollbar */
  hoverOffset?: boolean;
}
