import {
  Component,
  Input,
  ContentChild,
  inject,
  createComponent,
  OnInit,
  Injector,
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
export class NgScrollbarExt extends NgScrollbarCore implements OnInit {

  private readonly renderer: Renderer2 = inject(Renderer2);

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  private viewportAdapter: ViewportAdapter;

  get viewport(): ViewportAdapter {
    return this.viewportAdapter;
  }

  scrollbars: Scrollbars;

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
   * Reference to the external viewport directive if used
   */
  @ContentChild(ScrollViewport, { static: true }) private customViewport: ScrollViewport;

  override ngOnInit(): void {
    if (this.customViewport) {
      this.viewportAdapter = this.customViewport.viewport;
    } else {
      let viewportElement: HTMLElement;
      // If viewport selector was defined, query the element
      if (this.externalViewport) {
        viewportElement = this.nativeElement.querySelector(this.externalViewport);
      }
      if (viewportElement) {
        this.viewportAdapter = new ViewportAdapter(viewportElement);
      } else {
        console.error(`[NgScrollbar]: Could not find the viewport element for the provided selector "${ this.externalViewport }"`);
      }
    }

    // If an external spacer selector is provided, attempt to query for it
    let spacerElement: HTMLElement;
    if (this.externalSpacer) {
      spacerElement = this.nativeElement.querySelector(this.externalSpacer);
      if (!spacerElement) {
        console.error(`[NgScrollbar]: Spacer element not found for the provided selector "${ this.externalSpacer }"`);
      }
    }

    // If an external content wrapper selector is provided, attempt to query for it
    let contentWrapperElement: HTMLElement;
    if (this.externalContentWrapper) {
      contentWrapperElement = this.nativeElement.querySelector(this.externalContentWrapper);
      if (!contentWrapperElement) {
        console.error(`[NgScrollbar]: Content wrapper element not found for the provided selector "${ this.externalContentWrapper }"`);
      }
    }

    // If no external spacer or content wrapper is provided, create a content wrapper element
    if (!this.externalSpacer && !this.externalContentWrapper) {
      contentWrapperElement = this.renderer.createElement('div');

      // Move all content of the viewport into the content wrapper
      const childNodes: ChildNode[] = Array.from(this.viewport.nativeElement.childNodes);
      childNodes.forEach((node: ChildNode) => this.renderer.appendChild(contentWrapperElement, node));

      // Append the content wrapper to the viewport
      this.renderer.appendChild(this.viewport.nativeElement, contentWrapperElement);
    }

    // Initialize viewport
    this.viewport.init(contentWrapperElement, spacerElement);

    // Attach scrollbars
    this.attachScrollbars();

    super.ngOnInit();
  }

  private attachScrollbars(): void {
    // Create the scrollbars component
    const scrollbarsRef: ComponentRef<Scrollbars> = createComponent(Scrollbars, {
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({ providers: [{ provide: NG_SCROLLBAR, useValue: this }] })
    });
    // Attach scrollbar to the content wrapper
    this.viewport.contentWrapperElement.appendChild(scrollbarsRef.location.nativeElement);
    // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks run.
    this.appRef.attachView(scrollbarsRef.hostView);
    // Set the scrollbars instance
    this.scrollbars = scrollbarsRef.instance;

  }
}
