import { InjectionToken } from '@angular/core';

export type ScrollbarAppearance = 'standard' | 'compact' | undefined;
export type ScrollbarTrack = 'vertical' | 'horizontal' | 'all' | undefined;
export type ScrollbarVisibility = 'hover' | 'always' | 'native' | undefined;
export type ScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll' | undefined;

export interface NgScrollbarDefaultOptions {
  /**
   * Sets the scroll axis of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar-control
   * - `horizontal` Use both vertical and horizontal scrollbar-control
   * - `all` Use both vertical and horizontal scrollbar-control
   */
  track?: ScrollbarTrack;
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
  /** A class forwarded to scrollable viewport element */
  viewClass?: string;
  /** A class forwarded to the scrollbar track element */
  trackClass?: string;
  /** A class forwarded to the scrollbar thumb element */
  thumbClass?: string;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  scrollToDuration?: number;
  /** The minimum scrollbar thumb size in px */
  minThumbSize?: number;
  /** A flag used to enable/disable the scrollbar thumb dragged event */
  disableThumbDrag?: boolean;
  /** A flag used to enable/disable the scrollbar track clicked event */
  disableTrackClick?: boolean;
  /** Debounce interval for detecting changes via window.resize event */
  windowResizeDebounce?: number;
  /** Debounce interval for detecting changes via content observer
   * TODO: not working
   */
  contentObserverDebounce?: number;
  resizeObserverDebounce?: number;
}

export const ngScrollbarDefaultOptions: NgScrollbarDefaultOptions = {
  viewClass: '',
  trackClass: '',
  thumbClass: '',
  track: 'vertical',
  appearance: 'standard',
  visibility: 'native',
  position: 'native',
  disableThumbDrag: false,
  disableTrackClick: false,
  scrollToDuration: 300,
  minThumbSize: 20,
  windowResizeDebounce: 200,
  contentObserverDebounce: 0,
  resizeObserverDebounce: 0
};

/** Injection token to be used to override the default options for NgScrollbar components. */
export const NG_SCROLLBAR_DEFAULT_OPTIONS =
  new InjectionToken<NgScrollbarDefaultOptions>('ng-scrollbar-default-options', {
    providedIn: 'root',
    factory: (): NgScrollbarDefaultOptions => ngScrollbarDefaultOptions
  });
