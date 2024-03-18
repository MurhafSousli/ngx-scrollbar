import { Injectable, inject, ElementRef, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { coerceElement } from '@angular/cdk/coercion';
import { _Without, _YAxis } from '@angular/cdk/scrolling';
import {
  Observable,
  Subject,
  tap,
  take,
  merge,
  interval,
  finalize,
  fromEvent,
  takeUntil,
  takeWhile,
  animationFrameScheduler
} from 'rxjs';
import BezierEasing from './bezier-easing';
import {
  SMOOTH_SCROLL_OPTIONS,
  SmoothScrollElement,
  SmoothScrollToElementOptions,
  SmoothScrollToOptions
} from './smooth-scroll.model';

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollManager {

  private document: Document = inject(DOCUMENT);

  private zone: NgZone = inject(NgZone);

  // Default options
  private readonly _defaultOptions: SmoothScrollToOptions = {
    duration: 468,
    easing: {
      x1: 0.42,
      y1: 0,
      x2: 0.58,
      y2: 1
    },
    ...inject(SMOOTH_SCROLL_OPTIONS, { optional: true }),
  };

  // Keeps track of the ongoing SmoothScroll functions, so they can be handled in case of duplication.
  // Each scrolled element gets a destroyer stream which gets deleted immediately after it completes.
  // Purpose: If user called a scroll function again on the same element before the scrolls completes,
  // it cancels the ongoing scroll and starts a new one
  private onGoingScrolls: Map<Element, Subject<void>> = new Map<Element, Subject<void>>();

  /**
   * Timing method
   */
  private get now(): () => number {
    return this.document.defaultView.performance?.now?.bind(this.document.defaultView.performance) || Date.now;
  }

  /**
   * changes scroll position inside an element
   */
  private scrollElement(el: Element, x: number, y: number): void {
    el.scrollLeft = x;
    el.scrollTop = y;
  }

  /**
   * Handles a given parameter of type HTMLElement, ElementRef or selector
   */
  private getElement(el: Element | ElementRef | string, parent?: Element): Element {
    if (typeof el === 'string') {
      return (parent || this.document).querySelector(el);
    }
    return coerceElement<Element>(el);
  }

  /**
   * Initializes a destroyer stream, re-initializes it if the element is already being scrolled
   */
  private getScrollDestroyerRef(el: Element): Subject<void> {
    if (this.onGoingScrolls.has(el)) {
      this.onGoingScrolls.get(el).next();
    }
    return this.onGoingScrolls.set(el, new Subject<void>()).get(el);
  }

  /**
   * Terminates an ongoing smooth scroll
   */
  private interrupted(el: Element, destroyed: Subject<void>): Observable<Event | void> {
    return merge(
      fromEvent(el, 'wheel', { passive: true, capture: true }),
      fromEvent(el, 'touchmove', { passive: true, capture: true }),
      destroyed
    ).pipe(take(1));
  }

  private applyScrollToOptions(el: Element, options: SmoothScrollToOptions): Promise<void> {
    if (!options.duration) {
      this.scrollElement(el, options.left, options.top);
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.zone.runOutsideAngular(() => {
        // Initialize a destroyer stream, reinitialize it if the element is already being scrolled
        const destroyed: Subject<void> = this.getScrollDestroyerRef(el);

        const startTime: number = this.now();
        const startX: number = el.scrollLeft;
        const startY: number = el.scrollTop;
        const x: number = options.left == null ? el.scrollLeft : ~~options.left;
        const y: number = options.top == null ? el.scrollTop : ~~options.top;
        const duration: number = options.duration;
        const easing: (k: number) => number = BezierEasing(options.easing.x1, options.easing.y1, options.easing.x2, options.easing.y2);

        let currentX: number;
        let currentY: number;

        interval(0, animationFrameScheduler).pipe(
          tap(() => {
            let elapsed: number = (this.now() - startTime) / duration;
            // avoid elapsed times higher than one
            elapsed = elapsed > 1 ? 1 : elapsed;
            // apply easing to elapsed time
            const value: number = easing(elapsed);

            currentX = startX + (x - startX) * value;
            currentY = startY + (y - startY) * value;

            this.scrollElement(el, currentX, currentY);
          }),
          // Continue while target coordinates hasn't reached yet
          takeWhile(() => currentX !== x || currentY !== y),
          // Continue until interrupted by another scroll (new smooth scroll / wheel / touchmove)
          takeUntil(this.interrupted(el, destroyed)),
          // Once finished, clean up the destroyer stream and resolve the promise
          finalize(() => {
            destroyed.complete();
            this.onGoingScrolls.delete(el);
            this.zone.run(resolve);
          }),
        ).subscribe();
      });
    });
  }


  /**
   * Scrolls to the specified offsets. This is a normalized version of the browser's native scrollTo
   * method, since browsers are not consistent about what scrollLeft means in RTL. For this method
   * left and right always refer to the left and right side of the scrolling container irrespective
   * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
   * in an RTL context.
   * @param scrollable element
   * @param customOptions specified the offsets to scroll to.
   */
  scrollTo(scrollable: SmoothScrollElement, customOptions: SmoothScrollToOptions): Promise<void> {
    const el: Element = this.getElement(scrollable);
    const isRtl: boolean = getComputedStyle(el).direction === 'rtl';

    const options: SmoothScrollToOptions = {
      ...(this._defaultOptions as _Without<_YAxis>),
      ...customOptions,
      ...({
        // Rewrite start & end offsets as right or left offsets.
        left: customOptions.left == null ? (isRtl ? customOptions.end : customOptions.start) : customOptions.left,
        right: customOptions.right == null ? (isRtl ? customOptions.start : customOptions.end) : customOptions.right
      } as _Without<_YAxis>)
    };

    // Rewrite the bottom offset as a top offset.
    if (options.bottom != null) {
      options.top = el.scrollHeight - el.clientHeight - options.bottom;
    }

    // Rewrite the right offset as a left offset.
    if (isRtl) {
      if (options.left != null) {
        options.right = el.scrollWidth - el.clientWidth - options.left;
      }
      options.left = options.right ? -options.right : options.right;
    } else {
      if (options.right != null) {
        options.left = el.scrollWidth - el.clientWidth - options.right;
      }
    }
    return this.applyScrollToOptions(el, options);
  }

  /**
   * Scroll to element by reference or selector
   */
  scrollToElement(scrollable: SmoothScrollElement, target: SmoothScrollElement, customOptions: SmoothScrollToElementOptions = {}): Promise<void> {
    const scrollableEl: Element = this.getElement(scrollable);
    const targetEl: Element = this.getElement(target, scrollableEl);
    const rect: DOMRect = targetEl.getBoundingClientRect();
    const options: SmoothScrollToOptions = {
      ...customOptions,
      left: rect.left + (customOptions.left || 0),
      top: rect.top + (customOptions.top || 0)
    };
    return targetEl ? this.scrollTo(scrollableEl, options) : Promise.resolve();
  }
}
