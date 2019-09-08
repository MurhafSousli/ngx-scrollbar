import { ElementRef, Inject, Injectable, PLATFORM_ID, Optional, NgZone } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { coerceElement } from '@angular/cdk/coercion';
import { Directionality } from '@angular/cdk/bidi';
import { getRtlScrollAxisType, RtlScrollAxisType } from '@angular/cdk/platform';
import { _Bottom, _Left, _Right, _Top, _Without } from '@angular/cdk/scrolling';
import { fromEvent, merge, of, Observable, Subject } from 'rxjs';
import { expand, finalize, take, takeUntil, takeWhile } from 'rxjs/operators';
import {
  easeInOutQuad,
  SMOOTH_SCROLL_OPTIONS,
  SmoothScrollElement,
  SmoothScrollOptions,
  SmoothScrollStep,
  SmoothScrollToOptions
} from './smooth-scroll.model';

@Injectable({ providedIn: 'root' })
export class SmoothScrollManager {

  // Default options
  private _defaultOptions: SmoothScrollToOptions;

  // Keeps track of the ongoing SmoothScroll functions so they can be handled in case of duplication.
  // Each scrolled element gets a destroyer stream which gets deleted immediately after it completes.
  // Purpose: If user called a scroll function again on the same element before the scrolls completes,
  // it cancels the ongoing scroll and starts a new one
  private _onGoingScrolls = new Map<HTMLElement, Subject<void>>();

  private get _w(): any {
    return this._document.defaultView;
  }

  /**
   * Timing method
   */
  private get _now() {
    return this._w.performance && this._w.performance.now
      ? this._w.performance.now.bind(this._w.performance)
      : Date.now;
  }

  constructor(private _zone: NgZone,
              private _dir: Directionality,
              @Inject(DOCUMENT) private _document: any,
              @Inject(PLATFORM_ID) private _platform: object,
              @Optional() @Inject(SMOOTH_SCROLL_OPTIONS) customDefaultOptions: SmoothScrollToOptions) {
    this._defaultOptions = {
      duration: 468,
      easeFunc: easeInOutQuad,
      ...customDefaultOptions,
    };
  }

  /**
   * changes scroll position inside an element
   */
  private _scrollElement(el: HTMLElement, x: number, y: number): void {
    el.scrollLeft = x;
    el.scrollTop = y;
  }

  /**
   * Handles a given parameter of type HTMLElement, ElementRef or selector
   */
  private _getElement(el: HTMLElement | ElementRef | string, parent?: HTMLElement): HTMLElement {
    if (typeof el === 'string') {
      return (parent || this._document).querySelector<HTMLElement>(el);
    }
    return coerceElement<HTMLElement>(el);
  }

  /**
   * Initializes a destroyer stream, re-initializes it if the element is already being scrolled
   */
  private _initSmoothScroll(el: HTMLElement): Subject<void> {
    if (this._onGoingScrolls.has(el)) {
      this._onGoingScrolls.get(el).next();
    }
    return this._onGoingScrolls.set(el, new Subject<void>()).get(el);
  }

  /**
   * Checks if smooth scroll has reached, cleans up the smooth scroll stream and resolves its promise
   */
  private _isFinished(context: SmoothScrollStep, destroyed: Subject<void>, resolve: () => void): boolean {
    if (context.currentX !== context.x || context.currentY !== context.y) {
      return true;
    }
    destroyed.next();
    resolve();
    return false;
  }

  /**
   * Terminates an ongoing smooth scroll
   */
  private _interrupted(el: HTMLElement, destroyed: Subject<void>): Observable<any> {
    return merge(
      fromEvent(el, 'wheel', { passive: true, capture: true }),
      fromEvent(el, 'touchmove', { passive: true, capture: true }),
      destroyed
    ).pipe(take(1));
  }

  /**
   * Deletes the destroyer function, runs if the smooth scroll has finished or interrupted
   */
  private _destroy(el: HTMLElement, destroyed: Subject<void>): void {
    destroyed.complete();
    this._onGoingScrolls.delete(el);
  }

  /**
   * A function called recursively that, given a context, steps through scrolling
   */
  private _step(context: SmoothScrollStep): Observable<SmoothScrollStep> {
    return new Observable(observer => {
      const elapsed = this._now() - context.startTime;

      // avoid elapsed times higher than the duration
      if (elapsed >= context.duration) {
        context.currentX = context.x;
        context.currentY = context.y;
      } else {
        context.currentX = context.easeFunc(elapsed, context.startX, context.x - context.startX, context.duration);
        context.currentY = context.easeFunc(elapsed, context.startY, context.y - context.startY, context.duration);
      }

      this._scrollElement(context.scrollable, context.currentX, context.currentY);
      // Proceed to the step
      requestAnimationFrame(() => observer.next(context));
    });
  }

  private _applyScrollToOptions(el: HTMLElement, options: SmoothScrollToOptions): Promise<void> {
    if (!options.duration) {
      this._scrollElement(el, options.left, options.top);
      return Promise.resolve();
    }

    // Initialize a destroyer stream, reinitialize it if the element is already being scrolled
    const destroyed: Subject<void> = this._initSmoothScroll(el);

    const context: SmoothScrollStep = {
      scrollable: el,
      startTime: this._now(),
      startX: el.scrollLeft,
      startY: el.scrollTop,
      x: options.left == null ? el.scrollLeft : ~~options.left,
      y: options.top == null ? el.scrollTop : ~~options.top,
      duration: options.duration || this._defaultOptions.duration,
      easeFunc: options.easeFunc || this._defaultOptions.easeFunc
    };

    return new Promise(resolve => {
      // Scroll each step recursively
      of(null).pipe(
        expand(() => this._step(context).pipe(
          takeWhile((currContext: SmoothScrollStep) => this._isFinished(currContext, destroyed, resolve))
        )),
        takeUntil(this._interrupted(el, destroyed)),
        finalize(() => this._destroy(el, destroyed))
      ).subscribe();
    });
  }


  /**
   * Scrolls to the specified offsets. This is a normalized version of the browser's native scrollTo
   * method, since browsers are not consistent about what scrollLeft means in RTL. For this method
   * left and right always refer to the left and right side of the scrolling container irrespective
   * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
   * in an RTL context.
   * @param scrollable element
   * @param options specified the offsets to scroll to.
   */
  scrollTo(scrollable: SmoothScrollElement, options: SmoothScrollToOptions): Promise<void> {
    if (isPlatformBrowser(this._platform)) {
      const el = this._getElement(scrollable);
      const isRtl = getComputedStyle(el).direction === 'rtl';
      const rtlScrollAxisType = getRtlScrollAxisType();

      // Rewrite start & end offsets as right or left offsets.
      options.left = options.left == null ? (isRtl ? options.end : options.start) : options.left;
      options.right = options.right == null ? (isRtl ? options.start : options.end) : options.right;

      // Rewrite the bottom offset as a top offset.
      if (options.bottom != null) {
        (options as _Without<_Bottom> & _Top).top = el.scrollHeight - el.clientHeight - options.bottom;
      }

      // Rewrite the right offset as a left offset.
      if (isRtl && rtlScrollAxisType !== RtlScrollAxisType.NORMAL) {
        if (options.left != null) {
          (options as _Without<_Left> & _Right).right = el.scrollWidth - el.clientWidth - options.left;
        }

        if (rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
          options.left = options.right;
        } else if (rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
          options.left = options.right ? -options.right : options.right;
        }
      } else {
        if (options.right != null) {
          (options as _Without<_Right> & _Left).left = el.scrollWidth - el.clientWidth - options.right;
        }
      }
      return this._applyScrollToOptions(el, options);
    }
  }

  /**
   * Scroll to element by reference or selector
   */
  scrollToElement(scrollable: SmoothScrollElement, target: SmoothScrollElement, options: SmoothScrollOptions & _Top & _Left): Promise<void> {
    const scrollableEl = this._getElement(scrollable);
    const targetEl = this._getElement(target, scrollableEl);
    const duration = options.duration;
    const easeFunc = options.easeFunc;
    return targetEl ? this.scrollTo(scrollableEl, {
      left: targetEl.offsetLeft + (options.left || 0),
      top: targetEl.offsetTop + (options.top || 0),
      duration,
      easeFunc
    }) : new Promise(null);
  }

  /**
   * Scroll to top
   * @deprecated since version 6.0, use scrollTo({ top: 0}) instead
   */
  scrollToTop(scrollable: SmoothScrollElement, options?: SmoothScrollOptions): Promise<void> {
    return this.scrollTo(scrollable, { top: 0, ...options });
  }

  /**
   * Scroll to bottom
   * @deprecated since version 6.0, use scrollTo({ bottom: 0}) instead
   */
  scrollToBottom(scrollable: SmoothScrollElement, options?: SmoothScrollOptions): Promise<void> {
    return this.scrollTo(scrollable, { bottom: 0, ...options });
  }

  /**
   *  Scroll to left
   * @deprecated since version 6.0, use scrollTo({ left: 0}) instead
   */
  scrollToLeft(scrollable: SmoothScrollElement, options?: SmoothScrollOptions): Promise<void> {
    return this.scrollTo(scrollable, { left: 0, ...options });
  }

  /**
   * Scroll to right
   * @deprecated since version 6.0, use scrollTo({ right: 0}) instead
   */
  scrollToRight(scrollable: SmoothScrollElement, options?: SmoothScrollOptions): Promise<void> {
    return this.scrollTo(scrollable, { right: 0, ...options });
  }
}

