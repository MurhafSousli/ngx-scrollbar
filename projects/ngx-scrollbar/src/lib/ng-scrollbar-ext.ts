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
import { ScrollViewport, ViewportAdapter } from './viewport';
import { Core } from './core';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from './ng-scrollbar.model';

@Component({
  selector: 'ng-scrollbar[externalViewport]',
  exportAs: 'ngScrollbar',
  template: '<ng-content/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ViewportAdapter
  ],
  styles: [`
    /*:host {*/
    /*  display: contents;*/
    /*}*/
  `]
})
export class NgScrollbarExt extends Core implements OnDestroy {

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  private readonly injector: Injector = inject(Injector);

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

  computedOptions: Signal<NgScrollbarOptions> = computed(() => {
    return {
      buttons: this.buttons(),
      position: this.position(),
      appearance: this.appearance(),
      visibility: this.visibility(),
      trackClass: this.trackClass(),
      thumbClass: this.thumbClass(),
      buttonClass: this.buttonClass(),
      orientation: this.orientation(),
      hoverOffset: this.hoverOffset(),
      disableSensor: this.disableSensor(),
      disableInteraction: this.disableInteraction(),
      sensorThrottleTime: this.sensorThrottleTime(),
      trackScrollDuration: this.trackScrollDuration()
    };
  });

  /**
   * Skip initializing the viewport and the scrollbar
   * this is used when the component needs to wait for 3rd party library to render
   */
  skipInit: boolean = false;

  constructor() {
    super();

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
    this.destroy();
  }

  initialize(viewportElement: HTMLElement, contentWrapperElement: HTMLElement, spacerElement: HTMLElement): void {
    this.viewportRef = createComponent(ScrollViewport, {
      hostElement: viewportElement,
      projectableNodes: [Array.from(viewportElement.childNodes)],
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({
        parent: this.injector,
        providers: [
          {
            provide: NG_SCROLLBAR_OPTIONS,
            useValue: this.computedOptions()
          }
        ]
      })
    });

    this.viewportRef.instance.contentWrapperElement = contentWrapperElement;
    this.viewportRef.instance.spacerElement = spacerElement;
    this.viewportRef.instance.afterInit.subscribe(() => this.afterInit.emit());
    this.viewportRef.instance.afterUpdate.subscribe(() => this.afterUpdate.emit());
    this.appRef.attachView(this.viewportRef.hostView);
  }

  destroy(): void {
    if (this.viewportRef) {
      this.appRef.detachView(this.viewportRef.hostView);
      this.viewportRef.destroy();
      this.viewportRef = null;
    }
  }

  getElement(selector: string): HTMLElement {
    return selector ? this.nativeElement.querySelector(selector) as HTMLElement : null;
  }
}
