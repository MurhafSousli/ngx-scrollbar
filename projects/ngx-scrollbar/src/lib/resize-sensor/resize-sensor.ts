import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone } from '@angular/core';
import { ResizeSensor } from 'css-element-queries';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';

@Directive({
  selector: '[resize-sensor], [resizeSensor]'
})
export class ResizeSensorDirective implements AfterContentInit, OnDestroy {

  private resizeSensor: ResizeSensor;

  constructor(private ngZone: NgZone, @Optional() private scrollbar: NgScrollbar) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Resize Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    this.scrollbar.resizeSensor = true;
    this.ngZone.runOutsideAngular(() =>
      this.resizeSensor = new ResizeSensor(this.scrollbar.view, () =>
        this.scrollbar.update()
      )
    );
  }

  ngOnDestroy() {
    this.resizeSensor.detach();
  }
}

@NgModule({
  declarations: [ResizeSensorDirective],
  exports: [ResizeSensorDirective]
})
export class ResizeSensorModule {
}
