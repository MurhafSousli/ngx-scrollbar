import { ElementRef, InjectionToken } from '@angular/core';
import { _Left, _Top, _XAxis, _YAxis } from '@angular/cdk/scrolling';

export const SMOOTH_SCROLL_OPTIONS = new InjectionToken<SmoothScrollOptions>('SMOOTH_SCROLL_OPTIONS');

export type SmoothScrollElement = HTMLElement | ElementRef<HTMLElement> | string;

export type SmoothScrollToOptions = _XAxis & _YAxis & SmoothScrollOptions;

export type SmoothScrollToElementOptions = _Top & _Left & SmoothScrollOptions;

export interface SmoothScrollOptions {
  duration?: number;
  easing?: BezierEasingOptions;
}

export interface SmoothScrollStep {
  scrollable: HTMLElement;
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

export interface BezierEasingOptions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
