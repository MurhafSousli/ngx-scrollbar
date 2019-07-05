import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { supportsScrollBehavior } from '@angular/cdk/platform';
import { animationFrameScheduler } from 'rxjs';

export type SmoothScrollEaseFunc = (t: number, s: number, c: number, d: number) => number;

interface SmoothScrollOptions {
  top?: number;
  left?: number;
  offsetTop: number;
  offsetLeft: number;
  duration: number;
  scrollFunc: (top: number, left: number) => void;
  easeFunc: SmoothScrollEaseFunc;
}

export interface SmoothScrollToOptions {
  top?: number;
  left?: number;
  duration?: number;
  easeFunc?: SmoothScrollEaseFunc;
}

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollManager {

  constructor(@Inject(PLATFORM_ID) private platform: object) {
  }

  private scrollFunc(view: HTMLElement, left: number, top: number) {
    if (supportsScrollBehavior()) {
      view.scrollTo({top, left});
    } else {
      view.scrollTop = top;
      view.scrollLeft = left;
    }
  }

  scrollTo(view: HTMLElement, options: SmoothScrollToOptions): Promise<void> {
    // Avoid SSR error
    if (isPlatformBrowser(this.platform)) {
      const scrollFunc = (left: number, top: number) => {
        if (supportsScrollBehavior()) {
          view.scrollTo({top, left});
        } else {
          view.scrollTop = top;
          view.scrollLeft = left;
        }
      };
      if (options.duration) {
        const smoothScrollOptions: SmoothScrollOptions = {
          top: options.top,
          left: options.left,
          duration: options.duration,
          easeFunc: options.easeFunc || easeInOutQuad,
          offsetTop: view.scrollTop,
          offsetLeft: view.scrollLeft,
          scrollFunc
        };
        return smoothScroll(smoothScrollOptions);
      }
      this.scrollFunc(view, options.left, options.top);
    }
    return Promise.resolve();
  }

  /** Scroll to element by reference */
  scrollToElement(view: HTMLElement, target: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return target ? this.scrollTo(view, {
      left: target.offsetLeft,
      top: target.offsetTop - offset,
      duration,
      easeFunc
    }) : Promise.resolve();
  }

  /** Scroll to element by selector */
  scrollToSelector(view: HTMLElement, selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollToElement(view, view.querySelector(selector), offset, duration, easeFunc);
  }

  /** Scroll to top */
  scrollToTop(view: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo(view, {top: 0 - offset, duration, easeFunc});
  }

  /** Scroll to bottom */
  scrollToBottom(view: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo(view, {top: view.scrollHeight - view.clientHeight, duration, easeFunc});
  }

  /** Scroll to left */
  scrollToLeft(view: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo(view, {left: 0 - offset, duration, easeFunc});
  }

  /** Scroll to right */
  scrollToRight(view: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo(view, {left: view.scrollWidth - offset, duration, easeFunc});
  }

}

export function smoothScroll(options: SmoothScrollOptions): Promise<void> {
  return new Promise(resolve => {
    let currentTime = 0;
    const increment = 10;
    let valX = options.offsetLeft;
    let valY = options.offsetTop;

    const animateScroll = () => {
      // increment the time
      currentTime += increment;
      // find the value with the easing function
      if (typeof options.left !== 'undefined') {
        const deltaX = options.left - options.offsetLeft;
        valX = options.easeFunc(currentTime, options.offsetLeft, deltaX, options.duration);
      }
      if (typeof options.top !== 'undefined') {
        const deltaY = options.top - options.offsetTop;
        valY = options.easeFunc(currentTime, options.offsetTop, deltaY, options.duration);
      }
      // scroll to position
      options.scrollFunc(valX, valY);
      // do the animation unless its over
      if (currentTime < options.duration) {
        animationFrameScheduler.schedule(animateScroll);
      } else {
        resolve();
      }
    };
    animateScroll();
  });
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
