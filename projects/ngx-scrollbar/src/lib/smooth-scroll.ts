import { animationFrameScheduler } from 'rxjs';

export type SmoothScrollEaseFunc = (t: number, s: number, c: number, d: number) => number;

export interface SmoothScrollOptions {
  startX: number;
  startY: number;
  toX?: number;
  toY?: number;
  duration: number;
  scrollFunc: (top: number, left: number) => void;
  easeFunc: SmoothScrollEaseFunc;
}

export function smoothScroll(options: SmoothScrollOptions): Promise<void> {
  return new Promise(resolve => {
    let currentTime = 0;
    const increment = 20;
    let valX = options.startX;
    let valY = options.startY;

    const animateScroll = () => {
      // increment the time
      currentTime += increment;
      // find the value with the easing function
      if (typeof options.toX !== 'undefined') {
        const changeX = options.toX - options.startX;
        valX = options.easeFunc(currentTime, options.startX, changeX, options.duration);
      }
      if (typeof options.toY !== 'undefined') {
        const changeY = options.toY - options.startY;
        valY = options.easeFunc(currentTime, options.startY, changeY, options.duration);
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
