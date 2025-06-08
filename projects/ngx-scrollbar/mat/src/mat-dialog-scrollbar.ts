import { Directive, inject, effect } from '@angular/core';
import { ViewportAdapter } from 'ngx-scrollbar';

@Directive({
  host: {
    // Make sure the viewport doesn't have padding
    '[style.padding]': '0'
  },
  selector: 'mat-dialog-content[ngScrollbar]',
})
export class NgScrollbarMatDialog {

  private readonly scrollbar: ViewportAdapter = inject(ViewportAdapter);

  // NOTE: The only minor issue with this directive is that the scrollbar will be displayed in compact appearance

  constructor() {
    effect(() => {
      if (this.scrollbar.initialized()) {
        // Assign dialog-content padding by using its class on the content wrapper
        this.scrollbar.contentWrapperElement.classList.add('mat-mdc-dialog-content');

        // Remove harmful styles applied by the class
        this.scrollbar.contentWrapperElement.style.maxHeight = 'unset';
        this.scrollbar.contentWrapperElement.style.overflow = 'unset';
        this.scrollbar.contentWrapperElement.style.display = 'flow-root';

        // Check if dialog title exists
        if (this.scrollbar.viewportElement.parentElement.parentElement.querySelector('[mat-dialog-title], [matDialogTitle]')) {
          this.scrollbar.contentWrapperElement.style.paddingTop = '0';
        }
      }
    });
  }
}
