import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { SmoothScrollModule } from '../smooth-scroll/smooth-scroll.module';

import { NgScrollbar } from './ng-scrollbar';
import { NgCustomScrollbar } from './scrollbars/ng-custom-scrollbar';
import { CustomScrollView } from './custom-scroll-view';

@NgModule({
  imports: [
    CommonModule,
    ObserversModule,
    LayoutModule,
    BidiModule,
    SmoothScrollModule
  ],
  declarations: [
    NgScrollbar,
    NgCustomScrollbar,
    CustomScrollView
  ],
  exports: [
    NgScrollbar,
    SmoothScrollModule,
    CustomScrollView
  ]
})
export class NgScrollbarModule {
}
