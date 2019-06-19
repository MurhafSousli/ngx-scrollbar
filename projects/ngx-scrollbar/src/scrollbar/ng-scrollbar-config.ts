import { InjectionToken } from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';

export type NgScrollbarAppearance = 'standard' | 'compact';
export type NgScrollbarDirection = 'vertical' | 'horizontal' | 'all';
export type NgScrollbarVisibility = 'hover' | 'always' | 'native';
export type NgScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll';

export interface NgScrollbarDefaultOptions {
  /** track: a string used to set the tracking directions */
  direction?: NgScrollbarDirection;
  /** appearance: a string used to set the tracking directions */
  appearance?: NgScrollbarAppearance;
  /** visibility: a string used to set the tracking directions */
  visibility?: NgScrollbarVisibility;
  /** position: a string used to set scrollbars positions */
  position?: NgScrollbarPosition;
  /** viewClass:  a class forwarded to scrollable viewport element */
  viewClass?: string;
  /** barClass: a class forwarded to the scrollbar(s) element(s) */
  barClass?: string;
  /** thumbClass: a class forwarded to the scrollbar thumbnail element */
  thumbClass?: string;
  /** scrollToDuration: a number used to set the duration of the smooth scroll functions */
  scrollToDuration?: number;
  /** disableOnBreakpoints: an array of string used to set the breakpoints that disable the scrollbar */
  disableOnBreakpoints?: string | string[] | 'unset';
  /** autoUpdate: Auto update scrollbar state when content changes */
  autoUpdate?: boolean;
}

/** Injection token to be used to override the default options for `ng-scrollbar`. */
export const NG_SCROLLBAR_DEFAULT_OPTIONS =
  new InjectionToken<NgScrollbarDefaultOptions>('ng-scrollbar-default-options', {
    providedIn: 'root',
    factory: (): NgScrollbarDefaultOptions => ({
      viewClass: '',
      barClass: '',
      thumbClass: '',
      direction: 'vertical',
      appearance: 'standard',
      visibility: 'native',
      position: 'native',
      scrollToDuration: 300,
      autoUpdate: false,
      disableOnBreakpoints: [
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]
    })
  });
