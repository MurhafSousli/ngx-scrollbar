import { NgModule } from '@angular/core';
import { NgScrollbarModule } from '../scrollbar/ng-scrollbar.module';
import {
  NgScrollbarReachedBottom,
  NgScrollbarReachedLeft,
  NgScrollbarReachedRight,
  NgScrollbarReachedTop
} from './ng-scrollbar-reached';

@NgModule({
  imports: [
    NgScrollbarModule
  ],
  declarations: [
    NgScrollbarReachedTop,
    NgScrollbarReachedBottom,
    NgScrollbarReachedRight,
    NgScrollbarReachedLeft
  ],
  exports: [
    NgScrollbarReachedTop,
    NgScrollbarReachedBottom,
    NgScrollbarReachedRight,
    NgScrollbarReachedLeft
  ]
})
export class NgScrollbarReachedModule {
}
