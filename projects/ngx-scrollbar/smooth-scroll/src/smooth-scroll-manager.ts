import { ElementRef, Inject, Injectable, PLATFORM_ID, Optional } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { coerceElement } from '@angular/cdk/coercion';
import { getRtlScrollAxisType, RtlScrollAxisType } from '@angular/cdk/platform';
import { _Bottom, _Left, _Right, _Top, _Without } from '@angular/cdk/scrolling';
import { fromEvent, merge, of, Observable, Subject, Subscriber, animationFrameScheduler } from 'rxjs';
import { expand, finalize, take, takeUntil, takeWhile } from 'rxjs/operators';
import BezierEasing from 'bezier-easing';
import {
  SMOOTH_SCROLL_OPTIONS,
  SmoothScrollElement,
  SmoothScrollOptions,
  SmoothScrollStep,
  SmoothScrollToOptions
} from './smooth-scroll.model';

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class SmoothScrollManager {

  // Default options
  private readonly _defaultOptions: SmoothScrollToOptions;

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

  constructor(@Inject(DOCUMENT) private _document: any,
              @Inject(PLATFORM_ID) private _platform: object,
              @Optional() @Inject(SMOOTH_SCROLL_OPTIONS) customDefaultOptions: SmoothScrollToOptions) {
    this._defaultOptions = {
      duration: 468,
      easing: {
        x1: 0.42,
        y1: 0,
        x2: 0.58,
        y2: 1
      },
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
      return (parent || this._document).querySelector(el);
    }
    return coerceElement<HTMLElement>(el);
  }

  /**
   * Initializes a destroyer stream, re-initializes it if the element is already being scrolled
   */
  private _initSmoothScroll(el: HTMLElement): Subject<void> {
    if (this._onGoingScrolls.has(el)) {
      this._onGoingScrolls.get(el)!.next();
    }
    return this._onGoingScrolls.set(el, new Subject<void>())!.get(el)!;
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
    return new Observable((subscriber: Subscriber<SmoothScrollStep>) => {
      let elapsed = (this._now() - context.startTime) / context.duration;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      const value = context.easing(elapsed);

      context.currentX = context.startX + (context.x - context.startX) * value;
      context.currentY = context.startY + (context.y - context.startY) * value;

      this._scrollElement(context.scrollable, context.currentX, context.currentY);
      // Proceed to the step
      animationFrameScheduler.schedule(() => subscriber.next(context));
    });
  }

  private _applyScrollToOptions(el: HTMLElement, options: SmoothScrollToOptions): Promise<void> {
    if (!options.duration!) {
      this._scrollElement(el, options!.left!, options!.top!);
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
      duration: options.duration!,
      easing: BezierEasing(options.easing!.x1!, options.easing!.y1!, options.easing!.x2!, options.easing!.y2!)
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
   * @param customOptions specified the offsets to scroll to.
   */
  scrollTo(scrollable: SmoothScrollElement, customOptions: SmoothScrollToOptions): Promise<void> {
    if (isPlatformBrowser(this._platform)) {
      const el = this._getElement(scrollable);
      const isRtl = getComputedStyle(el).direction === 'rtl';
      const rtlScrollAxisType = getRtlScrollAxisType();

      const options: SmoothScrollToOptions = {
        ...(this._defaultOptions as _Without<_Bottom & _Top>),
        ...customOptions,
        ...({
          // Rewrite start & end offsets as right or left offsets.
          left: customOptions.left == null ? (isRtl ? customOptions.end : customOptions.start) : customOptions.left,
          right: customOptions.right == null ? (isRtl ? customOptions.start : customOptions.end) : customOptions.right
        } as _Without<_Bottom & _Top>)
      };

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
    return Promise.resolve();
  }

  /**
   * Scroll to element by reference or selector
   */
  scrollToElement(scrollable: SmoothScrollElement, target: SmoothScrollElement, customOptions: SmoothScrollOptions & _Top & _Left): Promise<void> {
    const scrollableEl = this._getElement(scrollable);
    const targetEl = this._getElement(target, scrollableEl);
    const options: SmoothScrollToOptions = {
      ...customOptions,
      ...{
        left: targetEl.offsetLeft + (customOptions.left || 0),
        top: targetEl.offsetTop + (customOptions.top || 0)
      }
    };
    return targetEl ? this.scrollTo(scrollableEl, options) : Promise.resolve();
  }
}
