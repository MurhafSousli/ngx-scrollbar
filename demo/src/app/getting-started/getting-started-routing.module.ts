import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GettingStartedComponent } from './getting-started.component';

@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: GettingStartedComponent}
  ])],
  exports: [RouterModule]
})
export class GettingStartedRoutingModule {
}
