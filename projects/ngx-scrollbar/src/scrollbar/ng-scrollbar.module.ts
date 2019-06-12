import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { SmoothScrollModule } from '../smooth-scroll';

import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarY } from './scrollbars/ng-scrollbar-y';
import { NgScrollbarX } from './scrollbars/ng-scrollbar-x';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    ObserversModule,
    LayoutModule,
    BidiModule,
    SmoothScrollModule
  ],
  declarations: [
    NgScrollbar,
    NgScrollbarY,
    NgScrollbarX,
  ],
  exports: [
    NgScrollbar,
    SmoothScrollModule
  ]
})
export class NgScrollbarModule {
}
