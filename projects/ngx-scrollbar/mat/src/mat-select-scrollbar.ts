import { Directive, inject } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgScrollbar, ScrollbarAnywhere, ScrollbarRef } from 'ngx-scrollbar';

@Directive({
  selector: 'mat-select[matSelectScrollbar]'
})
export class NgScrollbarMatSelect {
  // TODO: Add all options by extending directive class

  private readonly matSelect: MatSelect = inject(MatSelect, { self: true });

  private readonly scrollbarAnywhere: ScrollbarAnywhere = inject(ScrollbarAnywhere);

  scrollbarRef: ScrollbarRef<NgScrollbar>;

  constructor() {
    this.matSelect.openedChange.pipe(
      takeUntilDestroyed()
    ).subscribe((opened: boolean) => {
      if (opened) {
        const id: string = `#${ this.matSelect.id }-panel`;
        this.scrollbarRef = this.scrollbarAnywhere.createScrollbar(id);
      } else {
        this.scrollbarRef.destroy();
        this.scrollbarRef = null;
      }
    });
  }
}
