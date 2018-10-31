import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { SmoothScrollModule } from '../smooth-scroll/smooth-scroll.module';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarThumb } from './ng-scrollbar-thumb';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    LayoutModule,
    SmoothScrollModule
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
