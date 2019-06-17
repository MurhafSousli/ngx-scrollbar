import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SmoothScroll } from './smooth-scroll';
import { SmoothScroller } from '../scrollbar/smooth-scroller';

@NgModule({
  imports: [ScrollingModule],
  declarations: [SmoothScroll],
  exports: [SmoothScroll],
  providers: [SmoothScroller]
})
export class SmoothScrollModule {
}
