import { AfterViewChecked, Directive, inject } from '@angular/core';
import { NgScrollbarExt } from './ng-scrollbar-ext';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport][asyncDetection]'
})
export class ScrollbarExtAsyncDetection implements AfterViewChecked {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt);

  constructor() {
    this.scrollbar.skipInit = true;
  }

  ngAfterViewChecked(): void {
    if (!this.scrollbar.viewport.initialized()) {
      const viewportElement: HTMLElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalViewport);

      const contentWrapperElement: HTMLElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalContentWrapper);
      if (viewportElement && contentWrapperElement) {
        // If an external spacer selector is provided, attempt to query for it
        let spacerElement: HTMLElement;
        if (this.scrollbar.externalSpacer) {
          spacerElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalSpacer);
        }

        this.scrollbar.viewport.init(viewportElement, contentWrapperElement, spacerElement);
        this.scrollbar.attachScrollbars();
      }
    }
  }
}
