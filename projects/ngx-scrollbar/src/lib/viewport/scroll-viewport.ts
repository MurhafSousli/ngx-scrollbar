import {
  Component,
  inject,
  createComponent,
  afterNextRender,
  Injector,
  Renderer2,
  OnDestroy,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ScrollContent } from './scroll-content';
import { Scrollbars } from '../scrollbars/scrollbars';
import { ViewportClasses } from '../utils/common';
import { NG_SCROLLBAR } from '../utils/scrollbar-base';
import { NgScrollbarCore } from '../ng-scrollbar-core';

@Component({
  host: {
    '[class.ng-scroll-external-viewport]': 'true'
  },
  selector: 'ng-scroll-viewport',
  template: '<ng-content/>',
  styleUrl: 'scroll-viewport.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_SCROLLBAR, useExisting: ScrollViewport },
  ]
})
export class ScrollViewport extends NgScrollbarCore implements OnDestroy {

  private readonly renderer: Renderer2 = inject(Renderer2);

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  private readonly injector: Injector = inject(Injector);

  /**
   * The element used to measure the content size and observe its changes.
   * It can be either the actual content wrapper or the spacer in case of virtual scroll.
   * TODO: rename to content size measurement or something relevant.
   */
  contentWrapperElement: HTMLElement | undefined;

  scrollbarsRef: ComponentRef<Scrollbars> | undefined;

  actualContentRef: ComponentRef<ScrollContent> | undefined;

  /**
   * The element that wraps the content inside the viewport.
   */
  actualContentElement: HTMLElement | undefined;

  /**
   * The spacer element used by virtual scroll component.
   */
  spacerElement: HTMLElement | undefined;

  constructor() {
    afterNextRender({
      write: () => {
        // Create scroll content
        this.createContentWrapper(this.actualContentElement);

        // When integrating the scrollbar with virtual scroll, the content wrapper will have fake size,
        // and a spacer element will have the real size
        // Therefore, if spaceElement is provided, it will be observed instead of the content wrapper
        if (this.spacerElement) {
          this.spacerElement.classList.add(ViewportClasses.Spacer);
          this.contentWrapperElement = this.spacerElement;
        } else {
          // If spacer is not provided, set it as the content wrapper
          this.contentWrapperElement = this.actualContentElement;
        }
        // Attach scrollbars
        this.attachScrollbars(this.contentWrapperElement);

        // Initialize viewport
        this.viewport.init(this.nativeElement, this.actualContentRef.location.nativeElement, this.spacerElement);
      }
    });
    super();
  }

  ngOnDestroy(): void {
    this.viewport.reset();

    if (this.scrollbarsRef) {
      this.appRef.detachView(this.scrollbarsRef.hostView);
      this.scrollbarsRef.destroy();
      this.scrollbarsRef = null;
    }

    if (this.actualContentRef) {
      this.appRef.detachView(this.actualContentRef.hostView);
      this.actualContentRef.destroy();
      this.actualContentRef = null;
    }
  }

  createContentWrapper(hostElement: HTMLElement): void {
    if (hostElement) {
      // Attach a content wrapper component to a given host element
      this.actualContentRef = createComponent(ScrollContent, {
        hostElement,
        elementInjector: this.injector,
        environmentInjector: this.appRef.injector,
        projectableNodes: [Array.from(hostElement.childNodes)]
      });
    } else {
      this.actualContentRef = createComponent(ScrollContent, {
        elementInjector: this.injector,
        environmentInjector: this.appRef.injector,
        projectableNodes: [Array.from(this.nativeElement.childNodes)]
      });
      this.actualContentElement = this.actualContentRef.location.nativeElement;
      this.renderer.appendChild(this.nativeElement, this.actualContentElement);
    }
    this.appRef.attachView(this.actualContentRef.hostView);
  }

  attachScrollbars(hostElement: HTMLElement): void {
    // Create the scrollbars component
    this.scrollbarsRef = createComponent(Scrollbars, {
      elementInjector: this.injector,
      environmentInjector: this.appRef.injector
    });
    this.renderer.appendChild(hostElement, this.scrollbarsRef.location.nativeElement);
    // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks run.
    this.appRef.attachView(this.scrollbarsRef.hostView);
  }
}
