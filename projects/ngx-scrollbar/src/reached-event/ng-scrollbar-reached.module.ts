import { NgModule } from '@angular/core';
import { NgScrollbarModule } from '../scrollbar/ng-scrollbar.module';
import { NgScrollbarReached } from './ng-scrollbar-reached';

@NgModule({
  imports: [
    NgScrollbarModule
  ],
  declarations: [
    NgScrollbarReached
  ],
  exports: [
    NgScrollbarReached
  ]
})
export class NgScrollbarReachedModule {
}
