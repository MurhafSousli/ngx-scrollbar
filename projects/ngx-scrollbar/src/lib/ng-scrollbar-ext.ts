import {
  Component,
  Input,
  inject,
  signal,
  effect,
  computed,
  untracked,
  createComponent,
  booleanAttribute,
  input,
  contentChild,
  Signal,
  InputSignal,
  WritableSignal,
  Injector,
  Renderer2,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy,
  EffectCleanupRegisterFn
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
  styleUrls: ['ng-scrollbar.scss'],
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
export class NgScrollbarExt extends NgScrollbarCore {

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

  // At the time being, InputSignal value cannot be overridden programmatically from another directive,
  altViewport: WritableSignal<HTMLElement> = signal<HTMLElement>(null);
  altContentWrapper: WritableSignal<HTMLElement> = signal<HTMLElement>(null);
  altSpacer: WritableSignal<HTMLElement> = signal<HTMLElement>(null);

  viewportElement: Signal<HTMLElement> = computed(() => {
    if (this.customViewport()) {
      return this.customViewport().nativeElement;
    }
    if (this.altViewport()) {
      return this.altViewport();
    }
    // If viewport selector was defined, query the element
    const selector: string = this.externalViewport();
    return selector ? this.nativeElement.querySelector(selector) : null;
  });

  viewportError: Signal<string> = computed(() => {
    return !this.viewportElement()
      ? `[NgScrollbar]: Could not find the viewport element for the provided selector "${ this.externalViewport() }"`
      : null;
  });

  contentWrapperElement: Signal<HTMLElement> = computed(() => {
    if (this.altContentWrapper()) {
      return this.altContentWrapper();
    }
    const selector: string = this.externalContentWrapper();
    return selector ? this.nativeElement.querySelector(selector) : null;
  });

  contentWrapperError: Signal<string> = computed(() => {
    return !this.contentWrapperElement() && this.externalContentWrapper()
      ? `[NgScrollbar]: Content wrapper element not found for the provided selector "${ this.externalContentWrapper() }"`
      : null;
  });

  spacerElement: Signal<HTMLElement> = computed(() => {
    if (this.altSpacer()) {
      return this.altSpacer();
    }
    const selector: string = this.externalSpacer();
    return selector ? this.nativeElement.querySelector(selector) : null
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
  @Input({ transform: booleanAttribute }) skipInit: boolean;

  /**
   * Reference to the external viewport directive if used
   */
  customViewport: Signal<ScrollViewport> = contentChild(ScrollViewport, { descendants: true });

  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      const viewportElement: HTMLElement = this.viewportElement();
      const spacerElement: HTMLElement = this.spacerElement();
      let contentWrapperElement: HTMLElement = this.contentWrapperElement();

      const viewportError: string = this.viewportError();
      const contentWrapperError: string = this.contentWrapperError();
      const spacerError: string = this.spacerError();

      untracked(() => {
        if (!this.skipInit) {
          const error: string = viewportError || contentWrapperError || spacerError;
          if (error) {
            console.error(error);
          } else {
            // If no external spacer or content wrapper is provided, create a content wrapper element
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
              this.attachScrollbars();
            }
          }
        }

        onCleanup(() => {
          if (this._scrollbarsRef) {
            this.appRef.detachView(this._scrollbarsRef.hostView);
            this._scrollbarsRef.destroy();
          }
        })
      });
    });
    super();
  }

  attachScrollbars(): void {
    // Create the scrollbars component
    this._scrollbarsRef = createComponent(Scrollbars, {
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({ providers: [{ provide: NG_SCROLLBAR, useValue: this }] })
    });
    // Attach scrollbar to the content wrapper
    this.viewport.contentWrapperElement.appendChild(this._scrollbarsRef.location.nativeElement);
    // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks run.
    this.appRef.attachView(this._scrollbarsRef.hostView);
    // Set the scrollbars instance
    this._scrollbars.set(this._scrollbarsRef.instance);
  }
}
