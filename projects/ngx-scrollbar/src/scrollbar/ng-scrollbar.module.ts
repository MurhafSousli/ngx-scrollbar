import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { SmoothScrollModule } from '../smooth-scroll/smooth-scroll.module';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarThumb } from './ng-scrollbar-thumb';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    SmoothScrollModule,
    LayoutModule
  ],
  declarations: [
    NgScrollbar,
    NgScrollbarThumb
  ],
  exports: [
    NgScrollbar
  ]
})
export class NgScrollbarModule {
}
