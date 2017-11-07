import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ObserversModule } from '@angular/cdk/observers';
import { ScrollbarComponent } from './native-scrollbar.component';

@NgModule({
  imports: [CommonModule, ObserversModule],
  declarations: [ScrollbarComponent],
  exports: [ScrollbarComponent]
})
export class ScrollbarModule {
}
