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

  scrollbarsRef: ComponentRef<Scrollbars> | undefined;

  contentWrapperRef: ComponentRef<ScrollContent> | undefined;

  /**
   * The element that wraps the content inside the viewport.
   */
  contentWrapperElement: HTMLElement | undefined;

  /**
   * The spacer element used by virtual scroll component.
   */
  spacerElement: HTMLElement | undefined;

  constructor() {
    afterNextRender({
      write: () => {
        // Create scroll content
        this.createContentWrapper(this.contentWrapperElement);
        // Attach scrollbars
        this.attachScrollbars(this.nativeElement);
        // Initialize viewport
        this.viewport.init(this.nativeElement, this.contentWrapperElement, this.spacerElement);
        // If spaceElement is provided, add the appropriate class
        if (this.spacerElement) {
          this.spacerElement.classList.add(ViewportClasses.Spacer);
        }
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

    if (this.contentWrapperRef) {
      this.appRef.detachView(this.contentWrapperRef.hostView);
      this.contentWrapperRef.destroy();
      this.contentWrapperRef = null;
    }
  }

  createContentWrapper(hostElement: HTMLElement): void {
    if (hostElement) {
      // Attach a content wrapper component to a given host element
      this.contentWrapperRef = createComponent(ScrollContent, {
        hostElement,
        elementInjector: this.injector,
        environmentInjector: this.appRef.injector,
        projectableNodes: [Array.from(hostElement.childNodes)]
      });
    } else {
      this.contentWrapperRef = createComponent(ScrollContent, {
        elementInjector: this.injector,
        environmentInjector: this.appRef.injector,
        projectableNodes: [Array.from(this.nativeElement.childNodes)]
      });
      this.contentWrapperElement = this.contentWrapperRef.location.nativeElement;
      this.renderer.appendChild(this.nativeElement, this.contentWrapperElement);
    }
    this.appRef.attachView(this.contentWrapperRef.hostView);
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
