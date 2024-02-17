import { NgModule } from '@angular/core';
import { NgScrollbar } from './ng-scrollbar';
import { ScrollViewport } from './viewport';
import { NgScrollbarExt } from './ng-scrollbar-ext';

@NgModule({
  imports: [
    NgScrollbar,
    ScrollViewport,
    NgScrollbarExt
  ],
  exports: [
    NgScrollbar,
    ScrollViewport,
    NgScrollbarExt
  ]
})
export class NgScrollbarModule {
}
