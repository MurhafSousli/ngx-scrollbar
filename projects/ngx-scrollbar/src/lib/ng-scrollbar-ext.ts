import {
  Component,
  Input,
  ContentChild,
  inject,
  OnInit,
  Injector,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy,
  ComponentFactoryResolver
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
    '[class.ng-scrollbar-external-viewport]': 'true'
  },
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbarExt },
    { provide: NgScrollbarCore, useExisting: NgScrollbar }
  ],
})
export class NgScrollbarExt extends NgScrollbarCore implements OnInit {

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  private readonly cfr: ComponentFactoryResolver = inject(ComponentFactoryResolver);

  private viewportAdapter: ViewportAdapter;

  private scrollbarWrapperRef: ComponentRef<Scrollbars>;

  get viewport(): ViewportAdapter {
    return this.viewportAdapter;
  }

  get scrollbars(): Scrollbars {
    return this.scrollbarWrapperRef?.instance;
  }

  /**
   * The selector used to query the viewport element
   */
  @Input() externalViewport: string;

  /**
   * The selector used to query the content wrapper element
   */
  @Input() externalContentWrapper: string;

  /**
   * The selector used to query the spacer element (virtual scroll integration)
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

    let spacerElement: HTMLElement;
    if (this.externalSpacer) {
      spacerElement = this.nativeElement.querySelector(this.externalSpacer);
      if (!spacerElement) {
        console.error(`[NgScrollbar]: Could not find the spacer element for the provided selector "${ this.externalSpacer }"`);
      }
    }

    let contentWrapperElement: HTMLElement;
    if (this.externalContentWrapper) {
      contentWrapperElement = this.nativeElement.querySelector(this.externalContentWrapper);
      if (!contentWrapperElement) {
        console.error(`[NgScrollbar]: Could not find the content wrapper element for the provided selector "${ this.externalContentWrapper }"`);
      }
    }

    this.viewport.init(contentWrapperElement, spacerElement);

    // Create/destroy ScrollbarWrapper component when disabled state changes
    if (!this.scrollbarWrapperRef) {
      const injector: Injector = Injector.create({ providers: [{ provide: NG_SCROLLBAR, useValue: this }] });
      this.scrollbarWrapperRef = this.cfr.resolveComponentFactory(Scrollbars).create(injector);
      // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks will run.
      this.appRef.attachView(this.scrollbarWrapperRef.hostView);
      // Move the created component inside the content wrapper
      this.viewport.contentWrapperElement.appendChild(this.scrollbarWrapperRef.location.nativeElement);
    }
    super.ngOnInit();
  }
}
