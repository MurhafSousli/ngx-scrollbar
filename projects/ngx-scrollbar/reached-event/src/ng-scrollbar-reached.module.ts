import { NgModule } from '@angular/core';
import {
  NgScrollbarReachedTop,
  NgScrollbarReachedBottom,
  NgScrollbarReachedStart,
  NgScrollbarReachedEnd
} from './ng-scrollbar-reached';

@NgModule({
  imports: [
    NgScrollbarReachedTop,
    NgScrollbarReachedBottom,
    NgScrollbarReachedStart,
    NgScrollbarReachedEnd
  ],
  exports: [
    NgScrollbarReachedTop,
    NgScrollbarReachedBottom,
    NgScrollbarReachedStart,
    NgScrollbarReachedEnd
  ]
})
export class NgScrollbarReachedModule {
}
