import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone } from '@angular/core';
import ResizeObserver from '@juggle/resize-observer';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';

@Directive({
  selector: '[resize-sensor], [resizeSensor]'
})
export class ResizeSensor implements AfterContentInit, OnDestroy {

  private resizeObserver: ResizeObserver;

  constructor(private ngZone: NgZone, @Optional() private scrollbar: NgScrollbar) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Resize Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    if (this.scrollbar.contentWrapper) {
      this.ngZone.runOutsideAngular(() => {
        this.resizeObserver = new ResizeObserver(() => this.scrollbar.update());
        this.resizeObserver.observe(this.scrollbar.contentWrapper);
      });
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

@NgModule({
  declarations: [ResizeSensor],
  exports: [ResizeSensor]
})
export class NgScrollbarResizeSensorModule {
}
