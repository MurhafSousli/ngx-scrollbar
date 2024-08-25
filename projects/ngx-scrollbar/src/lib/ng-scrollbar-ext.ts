import {
  Component,
  Input,
  ContentChild,
  inject,
  createComponent,
  booleanAttribute,
  OnInit,
  OnDestroy,
  Injector,
  Renderer2,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ScrollViewport } from './viewport';
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
    { provide: NgScrollbarCore, useExisting: NgScrollbar }
  ],
})
export class NgScrollbarExt extends NgScrollbarCore implements OnInit, OnDestroy {

  private readonly renderer: Renderer2 = inject(Renderer2);

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  _scrollbarsRef: ComponentRef<Scrollbars>;

  _scrollbars: Scrollbars;

  /**
   * Selector used to query the viewport element.
   */
  @Input() externalViewport: string;

  /**
   * Selector used to query the content wrapper element.
   */
  @Input() externalContentWrapper: string;

  /**
   * Selector used to query the spacer element (virtual scroll integration).
   * In the case of integrating the scrollbar with a virtual scroll component,
   * a spacer element is typically created to match the real size of the content.
   * The scrollbar will use the size of this spacer element for calculations instead of the content wrapper size.
   */
  @Input() externalSpacer: string;

  /**
   * Skip initializing the viewport and the scrollbar
   * this is used when the component needs to wait for 3rd party library to render
   */
  @Input({ transform: booleanAttribute }) skipInit: boolean;

  /**
   * Reference to the external viewport directive if used
   */
  @ContentChild(ScrollViewport, { static: true }) customViewport: ScrollViewport;

  override ngOnInit(): void {
    if (!this.skipInit) {
      this.detectExternalSelectors();
    }
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    // Destroy the attached scrollbars to avoid memory leak
    this._scrollbarsRef?.hostView.destroy();
  }

  private detectExternalSelectors(): void {
    let viewportElement: HTMLElement;
    if (this.customViewport) {
      viewportElement = this.customViewport.nativeElement;
    } else {
      // If viewport selector was defined, query the element
      if (this.externalViewport) {
        viewportElement = this.nativeElement.querySelector(this.externalViewport);
      }
      if (!viewportElement) {
        console.error(`[NgScrollbar]: Could not find the viewport element for the provided selector "${ this.externalViewport }"`);
        return;
      }
    }

    // If an external spacer selector is provided, attempt to query for it
    let spacerElement: HTMLElement;
    if (this.externalSpacer) {
      spacerElement = this.nativeElement.querySelector(this.externalSpacer);
      if (!spacerElement) {
        console.error(`[NgScrollbar]: Spacer element not found for the provided selector "${ this.externalSpacer }"`);
        return;
      }
    }

    // If an external content wrapper selector is provided, attempt to query for it
    let contentWrapperElement: HTMLElement;
    if (this.externalContentWrapper && !this.skipInit) {
      contentWrapperElement = this.nativeElement.querySelector(this.externalContentWrapper);
      if (!contentWrapperElement) {
        console.error(`[NgScrollbar]: Content wrapper element not found for the provided selector "${ this.externalContentWrapper }"`);
        return;
      }
    }

    // Make sure viewport element is defined to proceed
    if (viewportElement) {
      // If no external spacer or content wrapper is provided, create a content wrapper element
      if (!this.externalSpacer && !this.externalContentWrapper) {
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
    this._scrollbars = this._scrollbarsRef.instance;
  }
}
