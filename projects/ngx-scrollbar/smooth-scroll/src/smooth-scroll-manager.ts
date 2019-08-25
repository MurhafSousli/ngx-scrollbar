import { ElementRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { coerceElement } from '@angular/cdk/coercion';
import { fromEvent, merge, timer } from 'rxjs';
import { map, take, takeUntil, takeWhile, tap } from 'rxjs/operators';

export type SmoothScrollEaseFunc = (t: number, s: number, c: number, d: number) => number;

export interface SmoothScrollToOptions {
  top?: number;
  left?: number;
  duration?: number;
  easeFunc?: SmoothScrollEaseFunc;
}

interface ScrollToState {
  left: number;
  top: number;
  elapsedTime: number;
}

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class SmoothScrollManager {

  constructor(@Inject(PLATFORM_ID) private platform: object) {
  }

  scrollTo(viewElementOrRef: HTMLElement | ElementRef<HTMLElement>, options: SmoothScrollToOptions): Promise<void> {
    const view = coerceElement<HTMLElement>(viewElementOrRef);
    return new Promise<void>((resolve => {
      // Avoid SSR error
      if (isPlatformBrowser(this.platform)) {
        const easeFunc = options.easeFunc || easeInOutQuad;
        const startTime = Date.now();
        // Stream that emits once user scroll using mousewheel or touchmove events to cancel any ongoing smooth scroll
        const userInterrupt = merge(
          fromEvent(view, 'mousewheel', { passive: true, capture: true }),
          fromEvent(view, 'touchmove', { passive: true, capture: true })
        ).pipe(take(1));
        /**
         * TODO: Add a feature to automatically set a proper duration based on scroll distance relative to the viewport size
         * e.g. if scroll distance is twice as big as the viewport size, duration should be around ~800ms
         * and but if scroll distance is tiny then use ~300ms
         *
         * const getDuration = (distance: number, viewSize: number, scrollSize: number) => {
         *  if (distance > viewSize) {
         *    console.log(`[Should slow down] distance > viewSize`, distance, viewSize, scrollSize);
         *   return (distance % 50) * 100;
         *  } else {
         *    console.log(`[Should be fast] distance <= viewSize`, distance, viewSize, scrollSize);
         *    return (distance % 50) * 20;
         *  }
         * };
         * const durationX = (typeof options.left !== 'undefined') ? getDuration(~~Math.abs(options.left - view.scrollLeft), view.clientWidth, view.scrollWidth) : 0;
         * const durationY = (typeof options.top !== 'undefined') ? getDuration(~~Math.abs(options.top - view.scrollTop), view.clientHeight, view.scrollHeight) : 0;
         * const duration = Math.max(durationX, durationY);
         * console.log(`duration: ${ duration }`);
         */

        const ease = (elapsedTime: number, point: number, offset: number): number => {
          const delta = point - offset;
          return easeFunc(elapsedTime, offset, delta, options.duration);
        };

        const scrollLeft = view.scrollLeft;
        const scrollTop = view.scrollTop;
        timer(0, 20).pipe(
          map(() => {
            const elapsedTime = Date.now() - startTime;
            return {
              left: (typeof options.left !== 'undefined') ? ease(elapsedTime, options.left, scrollLeft) : scrollLeft,
              top: (typeof options.top !== 'undefined') ? ease(elapsedTime, options.top, scrollTop) : scrollTop,
              elapsedTime
            };
          }),
          tap((target: ScrollToState) => {
            view.scrollTop = target.top;
            view.scrollLeft = target.left;
          }),
          takeWhile((target: ScrollToState) => {
            const finished = !(target.elapsedTime < options.duration);
            if (finished) {
              resolve();
            }
            return !finished;
          }),
          takeUntil(userInterrupt)
        ).subscribe();
      }
    }));
  }

  /** Scroll to element by reference */
  scrollToElement(viewElementOrRef: HTMLElement | ElementRef<HTMLElement>,
                  targetElementOrRef: HTMLElement | ElementRef<HTMLElement>,
                  offset = 0, duration?: number,
                  easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    const target = coerceElement<HTMLElement>(targetElementOrRef);
    return target ? this.scrollTo(viewElementOrRef, {
      left: target.offsetLeft,
      top: target.offsetTop - offset,
      duration,
      easeFunc
    }) : Promise.resolve();
  }

  /** Scroll to element by selector */
  scrollToSelector(viewElementOrRef: HTMLElement | ElementRef<HTMLElement>,
                   selector: string,
                   offset = 0,
                   duration?: number,
                   easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    const view = coerceElement<HTMLElement>(viewElementOrRef);
    return this.scrollToElement(view, view.querySelector<HTMLElement>(selector), offset, duration, easeFunc);
  }

  /** Scroll to top */
  scrollToTop(viewElementOrRef: HTMLElement | ElementRef<HTMLElement>,
              offset = 0,
              duration?: number,
              easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo(viewElementOrRef, { top: 0 - offset, duration, easeFunc });
  }

  /** Scroll to bottom */
  scrollToBottom(viewElementOrRef: HTMLElement | ElementRef<HTMLElement>,
                 offset = 0,
                 duration?: number,
                 easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    const view = coerceElement<HTMLElement>(viewElementOrRef);
    return this.scrollTo(view, { top: view.scrollHeight - view.clientHeight, duration, easeFunc });
  }

  /** Scroll to left */
  scrollToLeft(viewElementOrRef: HTMLElement | ElementRef<HTMLElement>,
               offset = 0,
               duration?: number,
               easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo(viewElementOrRef, { left: 0 - offset, duration, easeFunc });
  }

  /** Scroll to right */
  scrollToRight(viewElementOrRef: HTMLElement | ElementRef<HTMLElement>,
                offset = 0,
                duration?: number,
                easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    const view = coerceElement<HTMLElement>(viewElementOrRef);
    return this.scrollTo(view, { left: view.scrollWidth - offset, duration, easeFunc });
  }
}

// easing functions http://goo.gl/5HLl8
export function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}
