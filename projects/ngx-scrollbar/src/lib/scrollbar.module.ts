import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollbarComponent } from './scrollbar.component';

@NgModule({
  imports: [CommonModule, ScrollingModule],
  declarations: [ScrollbarComponent],
  exports: [ScrollbarComponent]
})
export class ScrollbarModule {
}
