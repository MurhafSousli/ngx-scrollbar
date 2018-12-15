import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { BidiModule } from '@angular/cdk/bidi';
import { SmoothScrollModule } from '../smooth-scroll/smooth-scroll.module';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarY } from './ng-scrollbar-y';
import { NgScrollbarX } from './ng-scrollbar-x';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    LayoutModule,
    BidiModule,
    SmoothScrollModule
  ],
  declarations: [
    NgScrollbar,
    NgScrollbarY,
    NgScrollbarX
  ],
  exports: [
    NgScrollbar
  ]
})
export class NgScrollbarModule {
}
