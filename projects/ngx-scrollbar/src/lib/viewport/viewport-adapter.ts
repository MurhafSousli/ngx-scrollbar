import { Injectable, signal, WritableSignal } from '@angular/core';
import { ViewportClasses } from '../utils/common';

/**
 * Class representing a viewport adapter.
 * Provides methods and properties to interact with a viewport and its content.
 */
@Injectable()
export class ViewportAdapter {

  /**
   * Viewport native element
   */
  nativeElement: HTMLElement;
  /**
   * The element that wraps the content inside the viewport,
   * used to measure the content size and observe its changes.
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

  /** Content height */
  get contentHeight(): number {
    return this.contentWrapperElement.offsetHeight;
  }

  /** Content width */
  get contentWidth(): number {
    return this.contentWrapperElement.offsetWidth;
  }

  /** The remaining vertical scrollable distance. */
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
  init(viewportElement: HTMLElement, contentElement: HTMLElement, spacerElement?: HTMLElement): void {
    // Add viewport class
    viewportElement.classList.add(ViewportClasses.Viewport);
    this.nativeElement = viewportElement;

    // Add content wrapper class
    contentElement.classList.add(ViewportClasses.Content);

    // When integrating the scrollbar with virtual scroll, the content wrapper will have fake size,
    // and a spacer element will have the real size
    // Therefore, if spaceElement is provided, it will be observed instead of the content wrapper
    if (spacerElement) {
      // Set relative position on the spacer element to enable the functionality of sticky for the scrollbars
      spacerElement.style.position = 'relative';
      this.contentWrapperElement = spacerElement;
    } else {
      // If spacer is not provided, set it as the content wrapper
      this.contentWrapperElement = contentElement;
    }
    this.initialized.set(true);
  }

  reset(): void {
    this.nativeElement = null;
    this.contentWrapperElement = null;
    this.initialized.set(false);
  }

  /**
   * Scrolls the viewport vertically to the specified value.
   */
  scrollYTo(value: number): void {
    this.nativeElement.scrollTop = value;
  }

  /**
   * Scrolls the viewport horizontally to the specified value.
   */
  scrollXTo(value: number): void {
    this.nativeElement.scrollLeft = value;
  }
}
