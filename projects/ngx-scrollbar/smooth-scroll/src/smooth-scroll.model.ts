import { ElementRef, InjectionToken } from '@angular/core';
import { _XAxis, _YAxis } from '@angular/cdk/scrolling';

export const SMOOTH_SCROLL_OPTIONS = new InjectionToken<SmoothScrollOptions>('SMOOTH_SCROLL_OPTIONS');

export type SmoothScrollElement = HTMLElement | ElementRef<HTMLElement> | string;

export type SmoothScrollToOptions = _XAxis & _YAxis & SmoothScrollOptions;

export type SmoothScrollEaseFunc = (t: number, s: number, c: number, d: number) => number;

export interface SmoothScrollOptions {
  duration?: number;
  easeFunc?: SmoothScrollEaseFunc;
}

export interface SmoothScrollStep {
  scrollable: HTMLElement;
  startTime: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  duration: number;
  easeFunc: SmoothScrollEaseFunc;
  currentX?: number;
  currentY?: number;
}

// easing functions http://goo.gl/5HLl8
export function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}
