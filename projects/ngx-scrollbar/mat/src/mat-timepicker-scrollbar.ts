import { Directive, inject } from '@angular/core';
import { MatTimepicker } from '@angular/material/timepicker';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, of, switchMap, tap } from 'rxjs';
import { PopupScrollbar } from './popup-scrollbar';

@Directive({
  selector: 'mat-timepicker[matTimepickerScrollbar]'
})
export class NgScrollbarMatTimepicker extends PopupScrollbar {

  private readonly matTimepicker: MatTimepicker<Date> = inject(MatTimepicker, { self: true });

  constructor() {
    super();

    outputToObservable(this.matTimepicker.opened).pipe(
      switchMap(() => {
        this.init(`#${ this.matTimepicker.panelId }`);
        return outputToObservable(this.matTimepicker.closed);
      }),
      switchMap(() => {
        if ((this.matTimepicker as any)._animationsDisabled) {
          return of({});
        }
        // The MatTimepicker overlay has an exit animation by default, destroying the scrollbar before the timepicker; it won't get destroyed properly.
        return fromEvent(this.scrollbarRef.componentRef.instance.nativeElement, 'animationend');
      }),
      tap(() => this.destroy()),
      takeUntilDestroyed()
    ).subscribe();
  }
}
