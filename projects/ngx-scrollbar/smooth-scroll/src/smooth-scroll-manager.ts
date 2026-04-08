import { Injectable, inject, ElementRef, DOCUMENT } from '@angular/core';
import { coerceElement } from '@angular/cdk/coercion';
import {
  SMOOTH_SCROLL_OPTIONS,
  SmoothScrollElement,
  SmoothScrollToElementOptions,
  SmoothScrollOptions,
  SmoothScrollToOptions
} from './smooth-scroll.model';

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollManager {
  private readonly document = inject(DOCUMENT);

  private readonly _defaultOptions: SmoothScrollOptions = inject(SMOOTH_SCROLL_OPTIONS);

  private onGoingAnimations = new Map<Element, Animation>();
  private abortControllers = new Map<Element, AbortController>();

  /**
   * Handles a given parameter of type HTMLElement, ElementRef or selector
   */
  private getElement(el: Element | ElementRef | string, parent?: Element): Element {
    if (typeof el === 'string') {
      return (parent || this.document).querySelector(el);
    }
    return coerceElement<Element>(el);
  }

  private cancelOngoingAnimation(el: Element): void {
    const existingAnimation = this.onGoingAnimations.get(el);
    if (existingAnimation) {
      existingAnimation.cancel();
    }
    this.cleanup(el);
  }

  private cleanup(el: Element): void {
    const controller = this.abortControllers.get(el);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(el);
    }
    this.onGoingAnimations.delete(el);
  }

  private applyScrollToOptions(el: Element, options: SmoothScrollToOptions): Promise<void> {
    this.cancelOngoingAnimation(el);

    if (!options.duration) {
      el.scrollLeft = options.left ?? el.scrollLeft;
      el.scrollTop = options.top ?? el.scrollTop;

      // Ensure the browser performs a paint before resolving
      return new Promise(resolve => requestAnimationFrame(() => resolve()));
    }

    return new Promise((resolve) => {
      const startX = el.scrollLeft;
      const startY = el.scrollTop;
      const endX = options.left ?? startX;
      const endY = options.top ?? startY;

      // Convert Bezier options to CSS string
      const easingStr = `cubic-bezier(${options.easing.x1}, ${options.easing.y1}, ${options.easing.x2}, ${options.easing.y2})`;

      // Create dummy WAAPI animation to drive the timing
      const animation = el.animate([], {
        duration: options.duration,
        easing: easingStr
      });

      this.onGoingAnimations.set(el, animation);

      const controller = new AbortController();
      this.abortControllers.set(el, controller);

      const interrupt = () => controller.abort();
      el.addEventListener('wheel', interrupt, { passive: true, capture: true, signal: controller.signal });
      el.addEventListener('touchmove', interrupt, { passive: true, capture: true, signal: controller.signal });

      const update = () => {
        if (animation.playState !== 'running' || controller.signal.aborted) return;

        // Get the eased progress directly from the browser's WAAPI engine or fallback to 1 if finished
        const progress = (animation.effect?.getComputedTiming().progress as number) ?? 1;

        el.scrollLeft = startX + (endX - startX) * progress;
        el.scrollTop = startY + (endY - startY) * progress;

        requestAnimationFrame(update);
      };

      requestAnimationFrame(update);

      animation.onfinish = () => {
        if (!controller.signal.aborted) {
          el.scrollLeft = endX;
          el.scrollTop = endY;
        }
        this.cleanup(el);

        // Wait for the next frame to ensure the DOM layout is updated before resolving
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      };

      animation.oncancel = () => {
        this.cleanup(el);
        resolve();
      };

      controller.signal.addEventListener('abort', () => animation.cancel(), { once: true });
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
    };

    return this.applyScrollToOptions(scrollableEl, computedOptions);
  }
}
