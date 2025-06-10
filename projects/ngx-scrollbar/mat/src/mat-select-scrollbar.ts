import { Directive, inject } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupScrollbar } from './popup-scrollbar';

@Directive({
  selector: 'mat-select[matSelectScrollbar]'
})
export class NgScrollbarMatSelect extends PopupScrollbar {

  private readonly matSelect: MatSelect = inject(MatSelect, { self: true });

  constructor() {
    super();

    this.matSelect.openedChange.pipe(
      takeUntilDestroyed()
    ).subscribe((opened: boolean) => {
      if (opened) {
        this.init(`#${ this.matSelect.id }-panel`);
      } else {
        this.destroy();
      }
    });
  }
}
