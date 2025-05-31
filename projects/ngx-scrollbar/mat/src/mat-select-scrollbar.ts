import { Directive, inject, computed, Signal, OutputRefSubscription } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NgScrollbar,
  ScrollbarRef,
  NgScrollbarOptions,
  NgScrollbarAnywhere,
  ScrollbarInputOutputs
} from 'ngx-scrollbar';

@Directive({
  selector: 'mat-select[matSelectScrollbar]'
})
export class NgScrollbarMatSelect extends ScrollbarInputOutputs {

  private readonly matSelect: MatSelect = inject(MatSelect, { self: true });

  private readonly scrollbarAnywhere: NgScrollbarAnywhere = inject(NgScrollbarAnywhere);

  private computedOptions: Signal<NgScrollbarOptions> = computed<NgScrollbarOptions>(() => {
    return {
      buttons: this.buttons(),
      position: this.position(),
      visibility: this.visibility(),
      appearance: this.appearance(),
      thumbClass: this.thumbClass(),
      trackClass: this.trackClass(),
      buttonClass: this.buttonClass(),
      hoverOffset: this.hoverOffset(),
      orientation: this.orientation(),
      disableSensor: this.disableSensor(),
      sensorThrottleTime: this.sensorThrottleTime(),
      disableInteraction: this.disableInteraction(),
      trackScrollDuration: this.trackScrollDuration()
    }
  });

  scrollbarRef: ScrollbarRef<NgScrollbar>;

  constructor() {
    super();

    let afterInit: OutputRefSubscription;
    let afterUpdate: OutputRefSubscription;

    this.matSelect.openedChange.pipe(
      takeUntilDestroyed()
    ).subscribe((opened: boolean) => {
      if (opened) {
        const id: string = `#${ this.matSelect.id }-panel`;
        this.scrollbarRef = this.scrollbarAnywhere.createScrollbar(id, this.computedOptions());
        afterInit = this.scrollbarRef.componentRef.instance.viewport.afterInit.subscribe(() => this.afterInit.emit());
        afterUpdate = this.scrollbarRef.componentRef.instance.viewport.afterUpdate.subscribe(() => this.afterUpdate.emit());
      } else {
        afterInit?.unsubscribe();
        afterUpdate?.unsubscribe();
        this.scrollbarRef?.destroy();
        this.scrollbarRef = null;
      }
    });
  }
}
