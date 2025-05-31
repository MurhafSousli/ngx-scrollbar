import {
  Component,
  inject,
  computed,
  untracked,
  linkedSignal,
  createComponent,
  afterNextRender,
  input,
  Signal,
  InputSignal,
  Injector,
  OnDestroy,
  ElementRef,
  ComponentRef,
  ApplicationRef,
  WritableSignal,
  ChangeDetectionStrategy
} from '@angular/core';
import { SmoothScrollElement, SmoothScrollToElementOptions, SmoothScrollToOptions } from 'ngx-scrollbar/smooth-scroll';
import { ScrollViewport, ViewportAdapter } from './viewport';

@Component({
  selector: 'ng-scrollbar[externalViewport]',
  exportAs: 'ngScrollbar',
  template: '<ng-content/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ViewportAdapter,
      inputs: [
        'position',
        'buttons',
        'appearance',
        'thumbClass',
        'trackClass',
        'buttonClass',
        'visibility',
        'hoverOffset',
        'orientation',
        'disableSensor',
        'sensorThrottleTime',
        'disableInteraction',
        'trackScrollDuration'
      ],
      outputs: ['afterInit', 'afterUpdate']
    }
  ]
})
export class NgScrollbarExt implements OnDestroy {

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  private readonly injector: Injector = inject(Injector);

  private adapter: ViewportAdapter = inject(ViewportAdapter);

  readonly nativeElement: HTMLElement = inject(ElementRef).nativeElement;

  viewportRef: ComponentRef<ScrollViewport>;

  /**
   * Selector used to query the viewport element.
   */
  externalViewport: InputSignal<string> = input.required<string>();

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
    computation: (selector: string) => this._getElement(selector)
  });

  viewportError: Signal<string> = computed(() => {
    return !this.viewportElement()
      ? `[NgScrollbar]: Could not find the viewport element for the provided selector "${ this.externalViewport() }"`
      : null;
  });

  contentWrapperElement: WritableSignal<HTMLElement> = linkedSignal({
    source: this.externalContentWrapper,
    computation: (selector: string) => this._getElement(selector)
  });

  contentWrapperError: Signal<string> = computed(() => {
    return !this.contentWrapperElement() && this.externalContentWrapper()
      ? `[NgScrollbar]: Content wrapper element not found for the provided selector "${ this.externalContentWrapper() }"`
      : null;
  });

  spacerElement: WritableSignal<HTMLElement> = linkedSignal({
    source: this.externalSpacer,
    computation: (selector: string) => this._getElement(selector)
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
  skipInit: boolean = false;

  constructor() {
    afterNextRender({
      earlyRead: () => {
        if (this.skipInit) return;

        const viewportElement: HTMLElement = this.viewportElement();
        const contentWrapperElement: HTMLElement = this.contentWrapperElement();
        const spacerElement: HTMLElement = this.spacerElement();

        const viewportError: string = this.viewportError();
        const contentWrapperError: string = this.contentWrapperError();
        const spacerError: string = this.spacerError();

        untracked(() => {
          const error: string = viewportError || contentWrapperError || spacerError;
          if (error) {
            console.error(error);
          } else {
            this.initialize(viewportElement, contentWrapperElement, spacerElement);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy();
  }

  initialize(viewportElement: HTMLElement, contentWrapperElement: HTMLElement, spacerElement: HTMLElement): void {
    this.viewportRef = createComponent(ScrollViewport, {
      hostElement: viewportElement,
      projectableNodes: [Array.from(viewportElement.childNodes)],
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    this.viewportRef.instance.contentWrapperElement = contentWrapperElement;
    this.viewportRef.instance.spacerElement = spacerElement;
    this.appRef.attachView(this.viewportRef.hostView);
  }

  _destroy(): void {
    if (this.viewportRef) {
      this.appRef.detachView(this.viewportRef.hostView);
      this.viewportRef.destroy();
      this.viewportRef = null;
    }
  }

  _getElement(selector: string): HTMLElement {
    return selector ? this.nativeElement.querySelector(selector) as HTMLElement : null;
  }

  /**
   * Smooth scroll functions
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.adapter.scrollTo(options);
  }

  /**
   * Scroll to an element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.adapter.scrollToElement(target, options);
  }
}
