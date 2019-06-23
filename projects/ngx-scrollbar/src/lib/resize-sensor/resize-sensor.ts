import { Directive, Optional, AfterViewInit, OnDestroy, Output, EventEmitter, NgZone } from '@angular/core';
import { ResizeSensor } from 'css-element-queries';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';

@Directive({
  selector: '[resized]'
})
export class ResizeSensorDirective implements AfterViewInit, OnDestroy {

  @Output() resized = new EventEmitter<{ width: number; height: number }>();

  private resizeSensor: ResizeSensor;

  constructor(private ngZone: NgZone, @Optional() private scrollbar: NgScrollbar) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Resized Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.resizeSensor = new ResizeSensor(
        this.scrollbar.view,
        (size: { width: number; height: number; }) => {
          // Update scrollbar
          this.scrollbar.update();
          this.resized.emit(size);
        }
      );
    });
  }

  ngOnDestroy() {
    this.resizeSensor.detach();
  }
}
