import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SmoothScroll } from './smooth-scroll';

@NgModule({
  imports: [ScrollingModule],
  declarations: [SmoothScroll],
  exports: [SmoothScroll]
})
export class SmoothScrollModule {
}
