import { InjectionToken } from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';

export type NgScrollbarReachedPoint = 'left' | 'top' | 'bottom' | 'right';
export type NgScrollbarAppearance = 'standard' | 'compact';
export type NgScrollbarTrack = 'vertical' | 'horizontal' | 'both';
export type NgScrollbarVisibility = 'hover' | 'always' | 'native';

export interface NgScrollbarDefaultOptions {
  /** track: a string used to set the tracking directions */
  track?: NgScrollbarTrack;
  /** appearance: a string used to set the tracking directions */
  appearance?: NgScrollbarAppearance;
  /** visibility: a string used to set the tracking directions */
  visibility?: NgScrollbarVisibility;
  /** viewClass:  a class forwarded to scrollable viewport element */
  viewClass?: string;
  /** barClass: a class forwarded to the scrollbar(s) element(s) */
  barClass?: string;
  /** thumbClass: a class forwarded to the scrollbar thumbnail element */
  thumbClass?: string;
  /** invertX: a flag used to invert the horizontal scrollbar position */
  invertX?: boolean;
  /** invertY: a flag used to invert the vertical scrollbar position  */
  invertY?: boolean;
  /** scrollToDuration: a number used to set the duration of the smooth scroll functions */
  scrollToDuration?: number;
  /** disableOnBreakpoints: an array of string used to set the breakpoints that disable the scrollbar */
  disableOnBreakpoints?: string[] | 'false';
  /** autoUpdate: Auto update scrollbar state when content changes */
  autoUpdate?: boolean;
}

/** Injection token to be used to override the default options for `ng-scrollbar`. */
export const NG_SCROLLBAR_DEFAULT_OPTIONS =
  new InjectionToken<NgScrollbarDefaultOptions>('ng-scrollbar-default-options', {
    providedIn: 'root',
    factory: () => ({
      viewClass: '',
      barClass: '',
      thumbClass: '',
      track: 'vertical',
      appearance: 'standard',
      visibility: 'native',
      invertX: false,
      invertY: false,
      scrollToDuration: 300,
      autoUpdate: false,
      disableOnBreakpoints: [
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]
    })
  });
