import { inject, computed, Signal, OutputRefSubscription } from '@angular/core';
import {
  NgScrollbar,
  NgScrollbarRef,
  NgScrollbarOptions,
  NgScrollbarAnywhere,
  ScrollbarInputOutputs
} from 'ngx-scrollbar';

export class PopupScrollbar extends ScrollbarInputOutputs {

  private readonly scrollbarAnywhere: NgScrollbarAnywhere = inject(NgScrollbarAnywhere);

  private computedOptions: Signal<NgScrollbarOptions> = computed<NgScrollbarOptions>(() => {
    return {
      withButtons: this.withButtons(),
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

  scrollbarRef: NgScrollbarRef<NgScrollbar>;
  private afterInitSub: OutputRefSubscription;
  private afterUpdateSub: OutputRefSubscription;

  init(id: string) {
    this.scrollbarRef = this.scrollbarAnywhere.createScrollbar(id, this.computedOptions());
    if (this.scrollbarRef) {
      const componentInstance: NgScrollbar = this.scrollbarRef.componentRef.instance;

      // The original CSS has an 8 px padding top and bottom on the viewport, this is already unset via CSS,
      // but we add the padding to the content wrapper
      componentInstance.nativeElement.style.setProperty('--_viewport-padding-block-start', '8px');
      componentInstance.nativeElement.style.setProperty('--_viewport-padding-block-end', '8px');

      this.afterInitSub = componentInstance.adapter.afterInit.subscribe(() => this.afterInit.emit());
      this.afterUpdateSub = componentInstance.adapter.afterUpdate.subscribe(() => this.afterUpdate.emit());
    }
  }

  destroy(): void {
    this.afterInitSub?.unsubscribe();
    this.afterUpdateSub?.unsubscribe();
    this.scrollbarRef?.destroy();
    this.scrollbarRef = null;
  }
}
