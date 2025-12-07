import { Injectable, inject, ElementRef, NgZone, DOCUMENT } from '@angular/core';

import { coerceElement } from '@angular/cdk/coercion';
import {
  Observable,
  Subscriber,
  Subject,
  take,
  merge,
  finalize,
  fromEvent,
  switchMap,
  takeUntil,
  takeWhile
} from 'rxjs';
import BezierEasing from './bezier-easing';
import {
  SMOOTH_SCROLL_OPTIONS,
  SmoothScrollElement,
  SmoothScrollStep,
  SmoothScrollToElementOptions,
  SmoothScrollOptions,
  SmoothScrollToOptions
} from './smooth-scroll.model';

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollManager {

  private document: Document = inject(DOCUMENT);

  private zone: NgZone = inject(NgZone);

  // Default options
  private readonly _defaultOptions: SmoothScrollOptions = inject(SMOOTH_SCROLL_OPTIONS);

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
   * A function called recursively that, given a context, steps through scrolling
   */
  private step(context: SmoothScrollStep): Observable<void> {
    return new Observable((subscriber: Subscriber<void>) => {
      let elapsed: number = (this.now() - context.startTime) / context.duration;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      const value: number = context.easing(elapsed);

      context.currentX = context.startX + (context.x - context.startX) * value;
      context.currentY = context.startY + (context.y - context.startY) * value;

      this.scrollElement(context.scrollable, context.currentX, context.currentY);
      // Proceed to the step
      requestAnimationFrame(() => {
        subscriber.next();
        subscriber.complete();
      });
    });
  }

  /**
   * Checks if smooth scroll has reached, cleans up the smooth scroll stream
   */
  private isReached(context: SmoothScrollStep, destroyed: Subject<void>): boolean {
    if (context.currentX === context.x && context.currentY === context.y) {
      // IMPORTANT: Destroy the stream when scroll is reached ASAP!
      destroyed.next();
      return true;
    }
    return false;
  }

  /**
   * Scroll recursively until coordinates are reached
   * @param context
   * @param destroyed
   */
  scrolling(context: SmoothScrollStep, destroyed: Subject<void>): Observable<void> {
    return this.step(context).pipe(
      // Continue while target coordinates hasn't reached yet
      takeWhile(() => !this.isReached(context, destroyed)),
      switchMap(() => this.scrolling(context, destroyed))
    );
  }

  /**
   * Deletes the destroyer function, runs if the smooth scroll has finished or interrupted
   */
  private onScrollReached(el: Element, resolve: () => void, destroyed: Subject<void>): void {
    destroyed.complete();
    this.onGoingScrolls.delete(el);
    this.zone.run(() => resolve());
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

    return new Promise((resolve: () => void) => {
      this.zone.runOutsideAngular(() => {
        // Initialize a destroyer stream, reinitialize it if the element is already being scrolled
        const destroyed: Subject<void> = this.getScrollDestroyerRef(el);

        const context: SmoothScrollStep = {
          scrollable: el,
          startTime: this.now(),
          startX: el.scrollLeft,
          startY: el.scrollTop,
          x: options.left == null ? el.scrollLeft : ~~options.left,
          y: options.top == null ? el.scrollTop : ~~options.top,
          duration: options.duration,
          easing: BezierEasing(options.easing.x1, options.easing.y1, options.easing.x2, options.easing.y2)
        };

        this.scrolling(context, destroyed).pipe(
          // Continue until interrupted by another scroll (new smooth scroll / wheel / touchmove)
          takeUntil(this.interrupted(el, destroyed)),
          // Once finished, clean up the destroyer stream and resolve the promise
          finalize(() => this.onScrollReached(el, resolve, destroyed)),
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
      ...this._defaultOptions,
      ...customOptions,
      ...{
        // Rewrite start & end offsets as right or left offsets.
        left: customOptions.left == null ? (isRtl ? customOptions.end : customOptions.start) : customOptions.left,
        right: customOptions.right == null ? (isRtl ? customOptions.start : customOptions.end) : customOptions.right
      }
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
    const isRtl: boolean = getComputedStyle(scrollableEl).direction === 'rtl';

    if (!targetEl || !scrollableEl) {
      return Promise.resolve();
    }

    const scrollableRect: DOMRect = scrollableEl.getBoundingClientRect();
    const targetRect: DOMRect = targetEl.getBoundingClientRect();

    const options: SmoothScrollToOptions = {
      ...this._defaultOptions,
      ...customOptions,
      ...{
        top: targetRect.top + scrollableEl.scrollTop - scrollableRect.top + (customOptions.top || 0),
        // Rewrite start & end offsets as right or left offsets.
        left: customOptions.left == null ? (isRtl ? customOptions.end : customOptions.start) : customOptions.left,
        right: customOptions.right == null ? (isRtl ? customOptions.start : customOptions.end) : customOptions.right
      }
    };

    if (customOptions.center) {
      // Calculate the center of the container
      const containerCenterX = scrollableRect.left + scrollableRect.width / 2;
      const containerCenterY = scrollableRect.top + scrollableRect.height / 2;

      // Calculate the target's position relative to the container
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      // Calculate the scroll position to center the target element in the container
      options.left = targetCenterX - containerCenterX + scrollableEl.scrollLeft;
      options.top = targetCenterY - containerCenterY + scrollableEl.scrollTop;
      return this.applyScrollToOptions(scrollableEl, options);
    }

    if (options.bottom != null) {
      const bottomEdge: number = scrollableRect.height - targetRect.height;
      options.top = targetRect.top + scrollableEl.scrollTop - scrollableRect.top - bottomEdge + (customOptions.bottom || 0);
    }

    // Rewrite the right offset as a left offset.
    if (isRtl) {
      options.left = targetRect.left - scrollableRect.left + scrollableEl.scrollLeft + (options.left || 0);
      if (options.right != null) {
        options.left = targetRect.right - scrollableRect.left + scrollableEl.scrollLeft - scrollableRect.width + (options.right || 0);
      }
    } else {
      options.left = targetRect.left - scrollableRect.left + scrollableEl.scrollLeft + (options.left || 0);
      if (options.right != null) {
        options.left = targetRect.right - scrollableRect.left + scrollableEl.scrollLeft - scrollableRect.width + (options.right || 0);
      }
    }

    const computedOptions: SmoothScrollToOptions = {
      top: options.top,
      left: options.left,
      easing: options.easing,
      duration: options.duration
    }

    return this.applyScrollToOptions(scrollableEl, computedOptions);
  }
}
