import {
  Injectable,
  inject,
  createComponent,
  Injector,
  ElementRef,
  ComponentRef,
  ApplicationRef,
  EnvironmentInjector,
  DOCUMENT
} from '@angular/core';

import { coerceElement } from '@angular/cdk/coercion';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { NgScrollbar } from './ng-scrollbar';
import { provideScrollbarOptions } from './ng-scrollbar.module';
import { NgScrollbarOptions } from './ng-scrollbar.model';

/**
 * Parameters for creating an extended scrollbar.
 */
interface ScrollbarParams {
  host: string | ElementRef | Element;
  viewport: string;
  contentWrapper?: string;
  spacer?: string;
}

/**
 * Generic scrollbar reference containing the component instance and a destroy function.
 */
export interface NgScrollbarRef<T> {
  componentRef: ComponentRef<T>;
  destroy: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NgScrollbarAnywhere {

  private readonly document: Document = inject(DOCUMENT);
  private readonly appRef: ApplicationRef = inject(ApplicationRef);
  private readonly environmentInjector: EnvironmentInjector = inject(EnvironmentInjector);

  /**
   * Generic method to create and attach a scrollbar component.
   * @param host - CSS selector for the host element.
   * @param component - The scrollbar component to create (either NgScrollbar or NgScrollbarExt).
   * @param options - Scrollbar options
   * @returns A reference to the created scrollbar component or null if the host is not found.
   */
  private createScrollbarComponent<T>(
    host: string | ElementRef | Element,
    component: new (...args: unknown[]) => T,
    options?: NgScrollbarOptions
  ): NgScrollbarRef<T> | null {

    const hostElement: Element = typeof host === 'string' ? this.document.querySelector(host) : coerceElement<Element>(host);
    if (!hostElement) {
      console.error(`[NgScrollbar]: Could not find the host element!`);
      return null;
    }

    // Create the scrollbar component
    let componentRef: ComponentRef<T> = createComponent(component, {
      hostElement,
      environmentInjector: this.environmentInjector,
      projectableNodes: [Array.from(hostElement.childNodes)],
      elementInjector: Injector.create({
        providers: [provideScrollbarOptions(options)]
      })
    });

    // Attach the component's view to the Angular change detection tree
    this.appRef.attachView(componentRef.hostView);

    return {
      componentRef,
      destroy: () => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        componentRef = null;
      }
    };
  }

  /**
   * Creates a basic scrollbar for a given host element.
   * @param host - CSS selector for the target element.
   * @param options - Scrollbar options
   * @returns A reference to the created scrollbar component.
   */
  createScrollbar(host: string | ElementRef | Element, options?: NgScrollbarOptions): NgScrollbarRef<NgScrollbar> | null {
    return this.createScrollbarComponent(host, NgScrollbar, options);
  }

  /**
   * Creates an extended scrollbar with external viewport and optional configurations.
   * @param params - Configuration options including host, viewport, and optional elements.
   * @param options - Scrollbar options
   * @returns A reference to the created extended scrollbar component.
   */
  createScrollbarExt(params: ScrollbarParams, options?: NgScrollbarOptions): NgScrollbarRef<NgScrollbarExt> | null {
    const scrollbarRef: NgScrollbarRef<NgScrollbarExt> = this.createScrollbarComponent(params.host, NgScrollbarExt, options);

    if (scrollbarRef) {
      scrollbarRef.componentRef.setInput('externalViewport', params.viewport);
      scrollbarRef.componentRef.setInput('externalContentWrapper', params.contentWrapper);
      scrollbarRef.componentRef.setInput('externalSpacer', params.spacer);
    }

    return scrollbarRef;
  }
}
