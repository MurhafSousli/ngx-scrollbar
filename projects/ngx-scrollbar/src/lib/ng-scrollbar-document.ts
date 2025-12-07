import { Injectable, inject, createComponent, Injector, ComponentRef, ApplicationRef, DOCUMENT } from '@angular/core';

import { ScrollViewport, ViewportAdapter } from './viewport';
import { NgScrollbarOptions } from './ng-scrollbar.model';
import { provideScrollbarOptions } from './ng-scrollbar.module';

@Injectable({
  providedIn: 'root'
})
export class NgScrollbarDocument {

  private readonly document: Document = inject(DOCUMENT);
  private readonly injector: Injector = inject(Injector);
  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  attachScrollbar(options?: NgScrollbarOptions): ComponentRef<ScrollViewport> {
    const viewport: HTMLElement = this.document.documentElement;
    const contentWrapper: HTMLElement = this.document.body;

    const scrollbarRef: ComponentRef<ScrollViewport> = createComponent(ScrollViewport, {
      hostElement: viewport,
      environmentInjector: this.appRef.injector,
      projectableNodes: [Array.from(viewport.childNodes)],
      elementInjector: Injector.create({
        parent: this.injector,
        providers: [
          ViewportAdapter,
          provideScrollbarOptions(options)
        ]
      })
    });
    scrollbarRef.instance.contentWrapperElement = contentWrapper;
    this.appRef.attachView(scrollbarRef.hostView);

    return scrollbarRef;
  }
}
