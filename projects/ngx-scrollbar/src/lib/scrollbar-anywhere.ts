import { Injectable, inject, createComponent, ComponentRef, ApplicationRef, EnvironmentInjector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { NgScrollbar } from './ng-scrollbar';

/**
 * Parameters for creating an extended scrollbar.
 */
interface ScrollbarParams {
  host: string;
  viewport: string;
  contentWrapper?: string;
  spacer?: string;
}

/**
 * Generic scrollbar reference containing the component instance and a destroy function.
 */
export interface ScrollbarRef<T> {
  componentRef: ComponentRef<T>;
  destroy: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollbarAnywhere {

  private readonly document: Document = inject(DOCUMENT);
  private readonly appRef: ApplicationRef = inject(ApplicationRef);
  private readonly environmentInjector: EnvironmentInjector = inject(EnvironmentInjector);

  /**
   * Generic method to create and attach a scrollbar component.
   * @param host - CSS selector for the host element.
   * @param component - The scrollbar component to create (either NgScrollbar or NgScrollbarExt).
   * @param projectNodes - Whether to project child nodes of the host element
   * @returns A reference to the created scrollbar component or null if the host is not found.
   */
  private createScrollbarComponent<T>(
    host: string,
    component: new (...args: any[]) => T,
    projectNodes?: boolean
  ): ScrollbarRef<T> | null {
    const hostElement: Element = this.document.querySelector(host);
    if (!hostElement) {
      console.error(`[NgScrollbar]: Could not find the host element for selector "${ host }"`);
      return null;
    }

    // Create the scrollbar component
    const componentRef: ComponentRef<T> = createComponent(component, {
      hostElement,
      environmentInjector: this.environmentInjector,
      projectableNodes: projectNodes ? [Array.from(hostElement.childNodes)] : []
    });

    // Attach the component's view to Angular's change detection tree
    this.appRef.attachView(componentRef.hostView);

    return {
      componentRef,
      destroy: () => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }
    };
  }

  /**
   * Creates a basic scrollbar for a given host element.
   * @param host - CSS selector for the target element.
   * @returns A reference to the created scrollbar component.
   */
  createScrollbar(host: string): ScrollbarRef<NgScrollbar> | null {
    return this.createScrollbarComponent(host, NgScrollbar, true);
  }

  /**
   * Creates an extended scrollbar with external viewport and optional configurations.
   * @param params - Configuration options including host, viewport, and optional elements.
   * @returns A reference to the created extended scrollbar component.
   */
  createScrollbarExt(params: ScrollbarParams): ScrollbarRef<NgScrollbarExt> | null {
    const scrollbarRef: ScrollbarRef<NgScrollbarExt> = this.createScrollbarComponent(params.host, NgScrollbarExt);

    if (scrollbarRef) {
      scrollbarRef.componentRef.setInput('externalViewport', params.viewport);
      scrollbarRef.componentRef.setInput('externalContentWrapper', params.contentWrapper);
      scrollbarRef.componentRef.setInput('externalSpacer', params.spacer);
    }

    return scrollbarRef;
  }
}
