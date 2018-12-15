import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { BidiModule } from '@angular/cdk/bidi';
import { SmoothScrollModule } from '../smooth-scroll/smooth-scroll.module';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarVertical } from './ng-scrollbar-vertical';
import { NgScrollbarHorizontal } from './ng-scrollbar-horizontal';

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
    NgScrollbarVertical,
    NgScrollbarHorizontal
  ],
  exports: [
    NgScrollbar
  ]
})
export class NgScrollbarModule {
}
