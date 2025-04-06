import {
  Component,
  inject,
  effect,
  computed,
  untracked,
  linkedSignal,
  createComponent,
  input,
  Signal,
  InputSignal,
  WritableSignal,
  Injector,
  OnDestroy,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ViewportAdapter, ScrollbarViewport } from './viewport';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';

@Component({
  selector: 'ng-scrollbar[externalViewport]',
  exportAs: 'ngScrollbar',
  template: '<ng-content/>',
  styleUrl: 'ng-scrollbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ng-scrollbar-external-viewport]': 'true'
  },
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbarExt },
    { provide: NgScrollbarCore, useExisting: NgScrollbar },
    ViewportAdapter
  ],
})
export class NgScrollbarExt extends NgScrollbarCore implements OnDestroy {

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  private readonly injector: Injector = inject(Injector);

  viewportRef: ComponentRef<ScrollbarViewport>;

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
    computation: (selector: string) => this.getElement(selector)
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
  skipInit: boolean = false;

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
    if (this.viewportRef) {
      this.appRef.detachView(this.viewportRef.hostView);
      this.viewportRef.destroy();
      this.viewportRef = null;
    }
  }

  initialize(viewportElement: HTMLElement, contentWrapperElement: HTMLElement, spacerElement: HTMLElement): void {
    if (this.skipInit) {
      // If initialized via async detection, then we should set the signals
      this.viewportElement.set(viewportElement);
      this.contentWrapperElement.set(contentWrapperElement);
      this.spacerElement.set(spacerElement);
    }

    this.viewportRef = createComponent(ScrollbarViewport, {
      hostElement: viewportElement,
      elementInjector: this.injector,
      environmentInjector: this.appRef.injector
    });
    this.viewportRef.instance.externalUse = true;
    this.viewportRef.instance.actualContentElement = this.contentWrapperElement();
    this.viewportRef.instance.spacerElement = this.spacerElement();
    this.appRef.attachView(this.viewportRef.hostView);
  }

  private getElement(selector: string): HTMLElement {
    return selector ? this.nativeElement.querySelector(selector) as HTMLElement : null;
  }
}
