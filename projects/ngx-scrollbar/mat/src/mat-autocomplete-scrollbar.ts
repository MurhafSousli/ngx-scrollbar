import { Directive, inject } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, tap } from 'rxjs';
import { PopupScrollbar } from './popup-scrollbar';

@Directive({
  selector: 'mat-autocomplete[matAutocompleteScrollbar]'
})
export class NgScrollbarMatAutocomplete extends PopupScrollbar {

  private readonly matAutocomplete: MatAutocomplete = inject(MatAutocomplete, { self: true });

  constructor() {
    super();

    merge(
      this.matAutocomplete.opened.pipe(tap(() => this.init(`#${ this.matAutocomplete.id }`))),
      this.matAutocomplete.closed.pipe(tap(() => this.destroy()))
    ).pipe(
      takeUntilDestroyed()
    ).subscribe();
  }
}
