import { ElementRef, InjectionToken, Provider } from '@angular/core';
import { _Left, _Top, _XAxis, _YAxis } from '@angular/cdk/scrolling';
import { defaultSmoothScrollOptions } from './smooth-scroll.default';

export const SMOOTH_SCROLL_OPTIONS: InjectionToken<SmoothScrollOptions> = new InjectionToken<SmoothScrollOptions>('SMOOTH_SCROLL_OPTIONS', {
  providedIn: 'root',
  factory: () => defaultSmoothScrollOptions
});

export function provideSmoothScrollOptions(options: SmoothScrollOptions): Provider[] {
  return [
    {
      provide: SMOOTH_SCROLL_OPTIONS,
      useValue: { ...defaultSmoothScrollOptions, ...options }
    }
  ]
}

/**
 * Interface for an element that can be scrolled smoothly.
 */
export type SmoothScrollElement = Element | ElementRef<Element> | string;

/**
 * Interface for options provided for smooth scrolling.
 */
export type SmoothScrollToOptions = Partial<Pick<_XAxis, keyof _XAxis> & Pick<_YAxis, keyof _YAxis>> & SmoothScrollOptions;

/**
 * Interface for options provided for smooth scrolling to an element.
 */
export type SmoothScrollToElementOptions = _Top & _Left & SmoothScrollOptions;

export interface SmoothScrollStep {
  scrollable: Element;
  startTime: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  duration: number;
  easing: (k: number) => number;
  currentX?: number;
  currentY?: number;
}

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
