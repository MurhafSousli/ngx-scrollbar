import { ElementRef, InjectionToken } from '@angular/core';
import { _Left, _Top, _XAxis, _YAxis } from '@angular/cdk/scrolling';

export const SMOOTH_SCROLL_OPTIONS: InjectionToken<SmoothScrollOptions> = new InjectionToken<SmoothScrollOptions>('SMOOTH_SCROLL_OPTIONS');

/**
 * Interface for an element that can be scrolled smoothly.
 */
export type SmoothScrollElement = Element | ElementRef<Element> | string;

/**
 * Interface for options provided for smooth scrolling.
 */
export type SmoothScrollToOptions = Partial<_XAxis> & Partial<_YAxis> & SmoothScrollOptions;

/**
 * Interface for options provided for smooth scrolling to an element.
 */
export type SmoothScrollToElementOptions = _Top & _Left & SmoothScrollOptions;

export interface SmoothScrollOptions {
  duration?: number;
  easing?: BezierEasingOptions;
}

export interface BezierEasingOptions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
