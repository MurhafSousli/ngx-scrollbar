import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ScrollbarX, ScrollbarY } from '../scrollbar/scrollbar';
import { ViewportAdapter } from '../viewport/viewport-adapter';

@Component({
  selector: 'scrollbars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollbarX, ScrollbarY],
  styleUrl: 'scrollbars.scss',
  template: `
    @if (adapter.verticalUsed()) {
      <scrollbar-y/>
    }
    @if (adapter.horizontalUsed()) {
      <scrollbar-x/>
    }
  `
})
export class Scrollbars {
  adapter: ViewportAdapter = inject(ViewportAdapter);
}
