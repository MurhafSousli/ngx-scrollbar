import { signal, WritableSignal } from '@angular/core';
import { ViewportClasses } from '../utils/common';

export class ViewportAdapter {

  nativeElement: HTMLElement;
  /**
   * The element that wraps the content inside the viewport,
   * used to measure the content size and observe its changes
   */
  contentWrapperElement: HTMLElement;

  /*
   * A signal that indicates when viewport adapter is initialized
   */
  initialized: WritableSignal<boolean> = signal(false);

  /** Viewport clientHeight */
  get offsetHeight(): number {
    return this.nativeElement.offsetHeight;
  }

  /** Viewport clientWidth */
  get offsetWidth(): number {
    return this.nativeElement.offsetWidth;
  }

  /** Viewport scrollTop */
  get scrollTop(): number {
    return this.nativeElement.scrollTop;
  }

  /** Viewport scrollLeft */
  get scrollLeft(): number {
    return this.nativeElement.scrollLeft;
  }

  /** Content height, falls back to scroll height */
  get contentHeight(): number {
    return this.contentWrapperElement?.offsetHeight;
  }

  /** Content width, falls back to scroll height */
  get contentWidth(): number {
    return this.contentWrapperElement?.offsetWidth;
  }

  /** The horizontal remaining scrollable distance */
  get scrollMaxX(): number {
    return this.contentWidth - this.offsetWidth;
  }

  /** The vertical remaining scrollable distance */
  get scrollMaxY(): number {
    return this.contentHeight - this.offsetHeight;
  }

  /**
   * Initialize viewport
   */
  init(viewport: HTMLElement, contentSelector: HTMLElement, spacerSelector?: HTMLElement): void {
    // Add viewport class
    viewport.classList.add(ViewportClasses.Viewport);
    this.nativeElement = viewport;

    // Add content wrapper class
    contentSelector.classList.add(ViewportClasses.Content);

    // When integrating the scrollbar with virtual scroll, the content wrapper will have fake size,
    // and a spacer element will have the real size
    // Therefore, if spaceElement is provided, it will be observed instead of the content wrapper
    if (spacerSelector) {
      // Set relative position on the spacer element to enable the functionality of sticky for the scrollbars
      spacerSelector.style.position = 'relative';
      this.contentWrapperElement = spacerSelector;
    } else {
      // If spacer is not provided, set it as the content wrapper
      this.contentWrapperElement = contentSelector;
    }
    this.initialized.set(true);
  }

  /**
   * Scroll viewport vertically
   */
  scrollYTo(value: number): void {
    this.nativeElement.scrollTop = value;
  }

  /**
   * Scroll viewport horizontally
   */
  scrollXTo(value: number): void {
    this.nativeElement.scrollLeft = value;
  }
}
