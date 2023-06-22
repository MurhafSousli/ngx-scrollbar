import { NgModule } from '@angular/core';
import { NgScrollbar } from './ng-scrollbar';
import { ScrollViewport } from './scroll-viewport';

@NgModule({
  imports: [
    NgScrollbar,
    ScrollViewport
  ],
  exports: [
    NgScrollbar,
    ScrollViewport
  ]
})
export class NgScrollbarModule {
}
