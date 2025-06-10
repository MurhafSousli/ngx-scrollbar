import { Directive, inject } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { PopupScrollbar } from './popup-scrollbar';

@Directive({
  selector: 'mat-autocomplete[matAutocompleteScrollbar]'
})
export class NgScrollbarMatAutocomplete extends PopupScrollbar {

  private readonly matAutocomplete: MatAutocomplete = inject(MatAutocomplete, { self: true });

  constructor() {
    super();

    this.matAutocomplete.opened.pipe(
      tap(() => this.init(`#${ this.matAutocomplete.id }`)),
      switchMap(() => this.matAutocomplete.closed),
      tap(() => this.destroy()),
      takeUntilDestroyed()
    ).subscribe();
  }
}
