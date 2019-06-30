import { InjectionToken } from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';

export type ScrollbarAppearance = 'standard' | 'compact' | undefined;
export type ScrollbarDirection = 'vertical' | 'horizontal' | 'all' | undefined;
export type ScrollbarVisibility = 'hover' | 'always' | 'native' | undefined;
export type ScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll' | undefined;

export interface NgScrollbarDefaultOptions {
  /**
   * Sets the supported scroll direction of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbars
   * - `horizontal` Use both vertical and horizontal scrollbars
   * - `all` Use both vertical and horizontal scrollbars
   */
  direction?: ScrollbarDirection;
  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbars
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  visibility?: ScrollbarVisibility;
  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `standard` (default) scrollbar space will be reserved just like with native scrollbars.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  appearance?: ScrollbarAppearance;
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbars.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbars positions
   */
  position?: ScrollbarPosition;
  /** A class forwarded to scrollable viewport element */
  viewClass?: string;
  /** A class forwarded to the scrollbar rail element */
  railClass?: string;
  /** A class forwarded to the scrollbar thumbnail element */
  thumbClass?: string;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  scrollToDuration?: number;
  /** disableOnBreakpoints: an array of string used to set the breakpoints that disable the scrollbar */
  disableOnBreakpoints?: string | string[] | 'unset';
}

/** Injection token to be used to override the default options for NgScrollbar components. */
export const NG_SCROLLBAR_DEFAULT_OPTIONS =
  new InjectionToken<NgScrollbarDefaultOptions>('ng-scrollbar-default-options', {
    providedIn: 'root',
    factory: (): NgScrollbarDefaultOptions => ({
      viewClass: '',
      railClass: '',
      thumbClass: '',
      direction: 'vertical',
      appearance: 'standard',
      visibility: 'native',
      position: 'native',
      scrollToDuration: 300,
      disableOnBreakpoints: [
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]
    })
  });
