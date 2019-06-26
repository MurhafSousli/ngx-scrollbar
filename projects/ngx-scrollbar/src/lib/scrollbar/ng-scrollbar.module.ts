import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { BidiModule } from '@angular/cdk/bidi';

import { NgScrollbar } from './ng-scrollbar';
import { NgCustomScrollbar } from './scrollbars/ng-custom-scrollbar';
import { ScrollView } from './scroll-view';
import { SmoothScrollManager } from '../smooth-scroll/smooth-scroll-manager';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    BidiModule
  ],
  declarations: [
    NgScrollbar,
    NgCustomScrollbar,
    ScrollView
  ],
  exports: [
    NgScrollbar,
    ScrollView
  ],
  providers: [
    SmoothScrollManager
  ]
})
export class NgScrollbarModule {
}
