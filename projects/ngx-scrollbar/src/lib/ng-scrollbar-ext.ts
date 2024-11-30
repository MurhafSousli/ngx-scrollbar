import {
  Component,
  inject,
  signal,
  effect,
  computed,
  untracked,
  linkedSignal,
  createComponent,
  input,
  contentChild,
  Signal,
  InputSignal,
  WritableSignal,
  Injector,
  OnDestroy,
  Renderer2,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ScrollViewport, ViewportAdapter } from './viewport';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

@Component({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport]',
  exportAs: 'ngScrollbar',
  template: '<ng-content/>',
  styleUrl: 'ng-scrollbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // This component appends a content wrapper element to the viewport
    // A hydration mismatch error will be thrown (NG0500) during DOM manipulation.
    // To avoid this error, the 'ngSkipHydration' attribute is added to skip hydration.
    ngSkipHydration: 'true',
    '[class.ng-scrollbar-external-viewport]': 'true'
  },
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbarExt },
    { provide: NgScrollbarCore, useExisting: NgScrollbar },
    ViewportAdapter
  ],
})
export class NgScrollbarExt extends NgScrollbarCore implements OnDestroy {

  private readonly renderer: Renderer2 = inject(Renderer2);

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  _scrollbarsRef: ComponentRef<Scrollbars>;

  _scrollbars: WritableSignal<Scrollbars> = signal<Scrollbars>(null);

  /**
   * Selector used to query the viewport element.
   */
  externalViewport: InputSignal<string> = input<string>();

  /**
   * Selector used to query the content wrapper element.
   */
  externalContentWrapper: InputSignal<string> = input<string>();

  /**
   * Selector used to query the spacer element (virtual scroll integration).
   * In the case of integrating the scrollbar with a virtual scroll component,
   * a spacer element is typically created to match the real size of the content.
   * The scrollbar will use the size of this spacer element for calculations instead of the content wrapper size.
   */
  externalSpacer: InputSignal<string> = input<string>();

  viewportElement: WritableSignal<HTMLElement> = linkedSignal({
    source: this.externalViewport,
    // If viewport selector was defined, query the element
    computation: (selector: string) => this.getElement(selector) || this.customViewport()?.nativeElement
  });

  viewportError: Signal<string> = computed(() => {
    return !this.viewportElement()
      ? `[NgScrollbar]: Could not find the viewport element for the provided selector "${ this.externalViewport() }"`
      : null;
  });

  contentWrapperElement: WritableSignal<HTMLElement> = linkedSignal({
    source: this.externalContentWrapper,
    computation: (selector: string) => this.getElement(selector)
  });

  contentWrapperError: Signal<string> = computed(() => {
    return !this.contentWrapperElement() && this.externalContentWrapper()
      ? `[NgScrollbar]: Content wrapper element not found for the provided selector "${ this.externalContentWrapper() }"`
      : null;
  });

  spacerElement: WritableSignal<HTMLElement> = linkedSignal({
    source: this.externalSpacer,
    computation: (selector: string) => this.getElement(selector)
  });

  spacerError: Signal<string> = computed(() => {
    return !this.spacerElement() && this.externalSpacer()
      ? `[NgScrollbar]: Spacer element not found for the provided selector "${ this.externalSpacer() }"`
      : null;
  });

  /**
   * Skip initializing the viewport and the scrollbar
   * this is used when the component needs to wait for 3rd party library to render
   */
  skipInit: boolean;

  /**
   * Reference to the external viewport directive if used
   */
  customViewport: Signal<ScrollViewport> = contentChild(ScrollViewport, { descendants: true });

  constructor() {
    // Using `afterRenderEffect` would run twice, one when viewport directive is detected
    // and one when content wrapper is detected, therefore `effect` is better because it runs only once.
    effect(() => {
      const viewportElement: HTMLElement = this.viewportElement();
      const contentWrapperElement: HTMLElement = this.contentWrapperElement();
      const spacerElement: HTMLElement = this.spacerElement();

      const viewportError: string = this.viewportError();
      const contentWrapperError: string = this.contentWrapperError();
      const spacerError: string = this.spacerError();

      untracked(() => {
        if (!this.skipInit) {
          const error: string = viewportError || contentWrapperError || spacerError;
          if (error) {
            console.error(error);
          } else {
            this.initialize(viewportElement, contentWrapperElement, spacerElement);
          }
        }
      });
    });
    super();
  }

  ngOnDestroy(): void {
    if (this._scrollbarsRef) {
      this.appRef.detachView(this._scrollbarsRef.hostView);
      this._scrollbarsRef.destroy();
    }
  }

  initialize(viewportElement: HTMLElement, contentWrapperElement: HTMLElement, spacerElement: HTMLElement): void {
    if (this.skipInit) {
      // If initialized via async detection, then we should set the signals
      this.viewportElement.set(viewportElement);
      this.contentWrapperElement.set(contentWrapperElement);
      this.spacerElement.set(spacerElement);
    }

    // If no external spacer and no content wrapper are provided, create a content wrapper element
    if (!spacerElement && !contentWrapperElement) {
      contentWrapperElement = this.renderer.createElement('div');

      // Move all content of the viewport into the content wrapper
      const childNodes: ChildNode[] = Array.from(viewportElement.childNodes);
      childNodes.forEach((node: ChildNode) => this.renderer.appendChild(contentWrapperElement, node));

      // Append the content wrapper to the viewport
      this.renderer.appendChild(viewportElement, contentWrapperElement);
    }

    // Make sure content wrapper element is defined to proceed
    if (contentWrapperElement) {
      // Initialize viewport
      this.viewport.init(viewportElement, contentWrapperElement, spacerElement);
      // Attach scrollbars
      this._attachScrollbars();
    }
  }

  _attachScrollbars(): void {
    // Create the scrollbars component
    this._scrollbarsRef = createComponent(Scrollbars, {
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({ providers: [{ provide: NG_SCROLLBAR, useValue: this }] })
    });
    // Attach scrollbar to the content wrapper
    this.renderer.appendChild(this.viewport.contentWrapperElement, this._scrollbarsRef.location.nativeElement)
    // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks run.
    this.appRef.attachView(this._scrollbarsRef.hostView);
    // Set the scrollbars instance
    this._scrollbars.set(this._scrollbarsRef.instance);
  }

  private getElement(selector: string): HTMLElement {
    return selector ? this.nativeElement.querySelector(selector) as HTMLElement : null;
  }
}
