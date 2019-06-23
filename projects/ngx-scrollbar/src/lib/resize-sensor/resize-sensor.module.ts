import { NgModule } from '@angular/core';
import { ResizeSensorDirective } from './resize-sensor';

@NgModule({
  declarations: [ResizeSensorDirective],
  exports: [ResizeSensorDirective]
})
export class ResizeSensorModule {
}
