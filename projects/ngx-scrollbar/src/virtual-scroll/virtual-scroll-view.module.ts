import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SmoothScrollModule } from '../smooth-scroll/smooth-scroll.module';
import { VirtualScrollView } from './virtual-scroll-view';

@NgModule({
  imports: [
    ScrollingModule,
    SmoothScrollModule
  ],
  declarations: [
    VirtualScrollView
  ],
  exports: [
    VirtualScrollView
  ]
})
export class VirtualScrollbarModule {
}

