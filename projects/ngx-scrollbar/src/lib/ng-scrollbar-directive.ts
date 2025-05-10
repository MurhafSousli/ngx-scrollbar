import {
  Directive,
  inject,
  output,
  computed,
  untracked,
  afterNextRender,
  createComponent,
  numberAttribute,
  booleanAttribute,
  input,
  Signal,
  Injector,
  OnDestroy,
  ElementRef,
  InputSignal,
  ComponentRef,
  ApplicationRef,
  OutputEmitterRef,
  InputSignalWithTransform
} from '@angular/core';
import {
  NG_SCROLLBAR_OPTIONS,
  NgScrollbarOptions,
  ScrollbarAppearance,
  ScrollbarOrientation,
  ScrollbarPosition,
  ScrollbarVisibility
} from './ng-scrollbar.model';
import { ScrollViewport, ViewportAdapter } from './viewport';

@Directive({
  selector: '[ngScrollbar]',
  providers: [ViewportAdapter]
})
export class NgScrollbarExtDirective implements OnDestroy {

  private readonly injector: Injector = inject(Injector);

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  private readonly nativeElement: HTMLElement = inject(ElementRef).nativeElement;

  /** Global options */
  private readonly options: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS);

  viewportRef: ComponentRef<ScrollViewport>;

  /**
   * Sets the supported scroll track of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar
   * - `horizontal` Use both vertical and horizontal scrollbar
   * - `auto` Use both vertical and horizontal scrollbar
   */
  orientation: InputSignal<ScrollbarOrientation> = input<ScrollbarOrientation>(this.options.orientation, {
    alias: 'sbOrientation'
  });

  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  visibility: InputSignal<ScrollbarVisibility> = input<ScrollbarVisibility>(this.options.visibility, {
    alias: 'sbVisibility'
  });

  /** Show scrollbar buttons */
  buttons: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.buttons, {
    alias: 'sbButtons',
    transform: booleanAttribute
  });

  /** Disables scrollbar interaction like dragging thumb and jumping by track click */
  disableInteraction: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableInteraction, {
    alias: 'sbDisableInteraction',
    transform: booleanAttribute
  });

  /** Whether ResizeObserver is disabled */
  disableSensor: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableSensor, {
    alias: 'sbDisableSensor',
    transform: booleanAttribute
  });

  /** Throttle interval for detecting changes via ResizeObserver */
  sensorThrottleTime: InputSignalWithTransform<number, string | number> = input<number, string | number>(this.options.sensorThrottleTime, {
    alias: 'sbSensorThrottleTime',
    transform: numberAttribute
  });

  /** A flag used to activate hover effect on the offset area around the scrollbar */
  hoverOffset: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.hoverOffset, {
    alias: 'sbHoverOffset',
    transform: booleanAttribute
  });

  /** Scroll duration when the scroll track is clicked */
  trackScrollDuration: InputSignalWithTransform<number, string | number> = input<number, string | number>(this.options.trackScrollDuration, {
    alias: 'sbTrackScrollDuration',
    transform: numberAttribute
  });

  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `native` (default) scrollbar space will be reserved just like with native scrollbar.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  appearance: InputSignal<ScrollbarAppearance> = input<ScrollbarAppearance>(this.options.appearance);
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar positions
   */
  position: InputSignal<ScrollbarPosition> = input<ScrollbarPosition>(this.options.position);

  /** A class forwarded to the scrollbar track element */
  trackClass: InputSignal<string> = input<string>(this.options.trackClass);
  /** A class forwarded to the scrollbar thumb element */
  thumbClass: InputSignal<string> = input<string>(this.options.thumbClass);
  /** A class forwarded to the scrollbar button element */
  buttonClass: InputSignal<string> = input<string>(this.options.thumbClass);

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

  /** Steam that emits when scrollbar is initialized */
  afterInit: OutputEmitterRef<void> = output<void>();

  /** Steam that emits when scrollbar is updated */
  afterUpdate: OutputEmitterRef<void> = output<void>();

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

  viewportElement: Signal<HTMLElement> = computed(() => this.getElement(this.externalViewport()));

  viewportError: Signal<string> = computed(() => {
    return !this.viewportElement()
      ? `[NgScrollbar]: Could not find the viewport element for the provided selector "${ this.externalViewport() }"`
      : null;
  });

  contentWrapperElement: Signal<HTMLElement> = computed(() => this.getElement(this.externalContentWrapper()));

  contentWrapperError: Signal<string> = computed(() => {
    return !this.contentWrapperElement() && this.externalContentWrapper()
      ? `[NgScrollbar]: Content wrapper element not found for the provided selector "${ this.externalContentWrapper() }"`
      : null;
  });

  spacerElement: Signal<HTMLElement> = computed(() => this.getElement(this.externalSpacer()));

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
    if (this.skipInit) return;
    afterNextRender({
      earlyRead: () => {
        // console.log('🧪 TEST')
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
    if (this.viewportRef) {
      this.appRef.detachView(this.viewportRef.hostView);
      this.viewportRef.destroy();
      this.viewportRef = null;
    }
  }

  initialize(viewportElement: HTMLElement, contentWrapperElement: HTMLElement, spacerElement: HTMLElement): void {
    this.viewportRef = createComponent(ScrollViewport, {
      hostElement: viewportElement,
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
    this.viewportRef.instance.actualContentElement = contentWrapperElement;
    this.viewportRef.instance.spacerElement = spacerElement;
    this.appRef.attachView(this.viewportRef.hostView);
  }

  private getElement(selector: string): HTMLElement {
    return selector ? this.nativeElement.querySelector(selector) as HTMLElement : null;
  }
}
