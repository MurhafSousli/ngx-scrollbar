import {
  Component,
  inject,
  createComponent,
  Injector,
  Renderer2,
  OnDestroy,
  ElementRef,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy, afterNextRender
} from '@angular/core';
import { ScrollbarContent } from './scrollbar-content';
import { ViewportAdapter } from './viewport-adapter';
import { Scrollbars } from '../scrollbars/scrollbars';
import { _NgScrollbar, NG_SCROLLBAR } from '../utils/scrollbar-base';

@Component({
  host: {
    '[class.ng-scroll-viewport]': 'true'
  },
  selector: 'scroll-viewport',
  template: '<ng-content/>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarViewport implements OnDestroy {

  private readonly host: _NgScrollbar = inject(NG_SCROLLBAR);

  private readonly renderer: Renderer2 = inject(Renderer2);

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  /** Viewport adapter instance */
  readonly viewport: ViewportAdapter = inject(ViewportAdapter);

  private readonly nativeElement: HTMLElement = inject(ElementRef).nativeElement;

  scrollbarsRef: ComponentRef<Scrollbars>;

  contentRef: ComponentRef<ScrollbarContent>;

  contentElement: HTMLElement;

  spacerElement: HTMLElement;

  constructor() {
    afterNextRender({
      // This is the right time when we can modify DOM, and also get the content and spacer elements
      write: () => {
        // Create scroll content
        this.createContentWrapper(this.contentElement);
        // Attach scrollbars
        this.attachScrollbars(this.spacerElement || this.contentRef.location.nativeElement);
        // Initialize viewport
        this.viewport.init(this.nativeElement, this.contentRef.location.nativeElement, this.spacerElement);
        // console.log('🦌', this.contentElement);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.scrollbarsRef) {
      this.appRef.detachView(this.scrollbarsRef.hostView);
      this.scrollbarsRef.destroy();
      this.scrollbarsRef = null;
    }

    if (this.contentRef) {
      this.appRef.detachView(this.contentRef.hostView);
      this.contentRef.destroy();
      this.contentRef = null;
    }
  }

  private createContentWrapper(hostElement: HTMLElement): void {
    if (hostElement) {
      this.contentRef = createComponent(ScrollbarContent, {
        hostElement,
        environmentInjector: this.appRef.injector
      });
    } else {
      this.contentRef = createComponent(ScrollbarContent, {
        environmentInjector: this.appRef.injector,
        projectableNodes: [Array.from(this.nativeElement.childNodes)]
      });
      this.renderer.appendChild(this.nativeElement, this.contentRef.location.nativeElement);
    }
    this.appRef.attachView(this.contentRef.hostView);
  }

  attachScrollbars(hostElement: HTMLElement): void {
    // Create the scrollbars component
    this.scrollbarsRef = createComponent(Scrollbars, {
      hostElement,
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({ providers: [{ provide: NG_SCROLLBAR, useValue: this.host }] }),
    });
    this.scrollbarsRef.location.nativeElement.style.display = 'block';
    // Attach scrollbar to the content wrapper
    // this.renderer.appendChild(hostElement, this.scrollbarsRef.location.nativeElement);
    // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks run.
    this.appRef.attachView(this.scrollbarsRef.hostView);
  }
}
