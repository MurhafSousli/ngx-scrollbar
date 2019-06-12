import { Directive, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { supportsScrollBehavior } from '@angular/cdk/platform';
import { animationFrameScheduler } from 'rxjs';

export type SmoothScrollEaseFunc = (t: number, s: number, c: number, d: number) => number;

export interface SmoothScrollOptions {
  top?: number;
  left?: number;
  offsetTop: number;
  offsetLeft: number;
  duration: number;
  scrollFunc: (top: number, left: number) => void;
  easeFunc: SmoothScrollEaseFunc;
}

export interface ScrollToOptions {
  top?: number;
  left?: number;
  duration?: number;
  easeFunc?: SmoothScrollEaseFunc;
}

@Directive({
  selector: '[smoothScroll], [smooth-scroll]'
})
export class SmoothScroll {

  private readonly view: HTMLElement;

  constructor(@Inject(PLATFORM_ID) private platform: Object,
              el: ElementRef) {
    this.view = el.nativeElement;
  }

  private scrollFunc(left: number, top: number) {
    if (supportsScrollBehavior()) {
      this.view.scrollTo({top, left});
    } else {
      this.view.scrollTop = top;
      this.view.scrollLeft = left;
    }
  }

  scrollTo(options: ScrollToOptions): Promise<void> {
    // Avoid SSR error
    if (isPlatformBrowser(this.platform)) {
      const scrollFunc = (left: number, top: number) => {
        if (supportsScrollBehavior()) {
          this.view.scrollTo({top, left});
        } else {
          this.view.scrollTop = top;
          this.view.scrollLeft = left;
        }
      };
      if (options.duration) {
        const smoothScrollOptions: SmoothScrollOptions = {
          top: options.top,
          left: options.left,
          duration: options.duration,
          easeFunc: options.easeFunc || easeInOutQuad,
          offsetTop: this.view.scrollTop,
          offsetLeft: this.view.scrollLeft,
          scrollFunc
        };
        return smoothScroll(smoothScrollOptions);
      }
      this.scrollFunc(options.left, options.top);
    }
    return Promise.resolve();
  }

  scrollToElement(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    const target: HTMLElement = this.view.querySelector(selector);
    return target ? this.scrollTo({left: target.offsetLeft, top: target.offsetTop - offset, duration, easeFunc}) : Promise.resolve();
  }

  scrollXTo(left: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo({left, duration, easeFunc});
  }

  scrollYTo(top: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollTo({top, duration, easeFunc});
  }

  scrollToTop(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollYTo(0, duration, easeFunc);
  }

  scrollToBottom(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollYTo(this.view.scrollHeight - this.view.clientHeight, duration, easeFunc);
  }

  scrollToRight(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollXTo(this.view.scrollWidth, duration, easeFunc);
  }

  scrollToLeft(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.scrollXTo(0, duration, easeFunc);
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

export function easeInCubic(t: number, b: number, c: number, d: number) {
  const tc = (t /= d) * t * t;
  return b + c * tc;
}

export function inOutQuintic(t: number, b: number, c: number, d: number) {
  const ts = (t /= d) * t,
    tc = ts * t;
  return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
}
