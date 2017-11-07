import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';

@NgModule({
  imports: [
    CommonModule,
    GettingStartedRoutingModule
  ],
  declarations: [GettingStartedComponent],
})
export class GettingStartedModule {
}
