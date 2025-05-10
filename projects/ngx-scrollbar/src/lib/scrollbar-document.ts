import { ApplicationRef, ComponentRef, createComponent, inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScrollViewport } from './viewport';

@Injectable({
  providedIn: 'root'
})
export class ScrollbarDocument {

  private readonly document: Document = inject(DOCUMENT);

  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  scrollbarRef: ComponentRef<ScrollViewport>;

  attachScrollbar(): void {
    const viewport: HTMLElement = this.document.documentElement;
    const contentWrapper: HTMLElement = this.document.body;

    this.scrollbarRef = createComponent(ScrollViewport, {
      hostElement: viewport,
      environmentInjector: this.appRef.injector
    });
    this.scrollbarRef.instance.actualContentElement = contentWrapper;
    this.appRef.attachView(this.scrollbarRef.hostView);
  }
}
