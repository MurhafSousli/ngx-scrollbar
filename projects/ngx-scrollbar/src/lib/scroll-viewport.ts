import { Directive, ElementRef } from '@angular/core';
import { Observable, Subscriber, fromEvent, merge, map, switchMap, takeUntil, tap } from 'rxjs';
import { stopPropagation } from './scrollbar/common';

@Directive({
    selector: '[scrollViewport]',
    standalone: true
})
export class ScrollViewport {
  // Viewport element
  readonly nativeElement: HTMLElement;
  // Content wrapper element
  contentWrapperElement!: HTMLElement;

  // Stream that emits when pointer event when the viewport is hovered and emits false value when isn't hovered
  hovered!: Observable<MouseEvent | false>;
  // Stream that emits when viewport is clicked
  clicked!: Observable<MouseEvent | false>;

  // Get viewport size, clientHeight or clientWidth
  get clientHeight(): number {
    return this.nativeElement.clientHeight;
  }

  get clientWidth(): number {
    return this.nativeElement.clientWidth;
  }

  get scrollHeight(): number {
    return this.nativeElement.scrollHeight;
  }

  get scrollWidth(): number {
    return this.nativeElement.scrollWidth;
  }

  // Get viewport scroll offset, scrollTop or scrollLeft
  get scrollTop(): number {
    return this.nativeElement.scrollTop;
  }

  get scrollLeft(): number {
    return this.nativeElement.scrollLeft;
  }

  // Get the available scrollable size
  get scrollMaxX(): number {
    return this.scrollWidth - this.clientWidth;
  }

  get scrollMaxY(): number {
    return this.scrollHeight - this.clientHeight;
  }

  get contentHeight(): number {
    return this.contentWrapperElement?.clientHeight || 0;
  }

  get contentWidth(): number {
    return this.contentWrapperElement?.clientWidth || 0;
  }

  constructor(public viewPort: ElementRef) {
    this.nativeElement = viewPort.nativeElement;
  }

  /**
   * Activate viewport pointer events such as 'hovered' and 'clicked' events
   */
  activatePointerEvents(propagate: boolean, destroyed: Observable<void>): void {
    this.hovered = new Observable((subscriber: Subscriber<MouseEvent | false>) => {
      // Stream that emits when pointer is moved over the viewport (used to set the hovered state)
      const mouseMoveStream = fromEvent<MouseEvent>(this.nativeElement, 'mousemove', { passive: true });
      const mouseMove = propagate ? mouseMoveStream : mouseMoveStream.pipe(stopPropagation());
      // Stream that emits when pointer leaves the viewport (used to remove the hovered state)
      const mouseLeave = fromEvent<false>(this.nativeElement, 'mouseleave', { passive: true }).pipe(map(() => false));
      merge(mouseMove, mouseLeave).pipe(
        tap((e: MouseEvent | false) => subscriber.next(e)),
        takeUntil(destroyed)
      ).subscribe();
    });

    this.clicked = new Observable((subscriber: Subscriber<MouseEvent | false>) => {
      const mouseDown = fromEvent<MouseEvent>(this.nativeElement, 'mousedown', { passive: true }).pipe(
        tap((e: MouseEvent) => subscriber.next(e))
      );
      const mouseUp = fromEvent<false>(this.nativeElement, 'mouseup', { passive: true }).pipe(
        tap(() => subscriber.next(false))
      );
      mouseDown.pipe(
        switchMap(() => mouseUp),
        takeUntil(destroyed)
      ).subscribe();
    });
  }

  /**
   * Set this directive as a non-functional wrapper, called when a custom viewport is used
   */
  setAsWrapper(): void {
    // In this case the default viewport and the default content wrapper will act as a mask
    this.nativeElement.className = 'ng-native-scrollbar-hider ng-scroll-layer';
    if (this.nativeElement.firstElementChild) {
      this.nativeElement.firstElementChild.className = 'ng-scroll-layer';
    }
  }

  /**
   * Set this directive as  the viewport, called when no custom viewport is used
   */
  setAsViewport(customClassName: string): void {
    this.nativeElement.className += `ng-native-scrollbar-hider ng-scroll-viewport ${ customClassName }`;
    // Check if the custom viewport has only one child and set it as the content wrapper
    if (this.nativeElement.firstElementChild) {
      this.contentWrapperElement = this.nativeElement.firstElementChild as HTMLElement;
      this.contentWrapperElement.classList.add('ng-scroll-content');
    }
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
