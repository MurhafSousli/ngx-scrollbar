import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ScrollbarX, ScrollbarY } from '../scrollbar/scrollbar';
import { ViewportAdapter } from '../viewport/viewport-adapter';

@Component({
  selector: 'scrollbars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollbarX, ScrollbarY],
  template: `
    @if (cmp.verticalUsed()) {
      <scrollbar-y/>
    }
    @if (cmp.horizontalUsed()) {
      <scrollbar-x/>
    }
  `,
  styleUrls: ['scrollbars.scss'],
  styles: [`
    :host {
      /*display: contents;*/
    }
  `]
})
export class Scrollbars {
  cmp: ViewportAdapter = inject(ViewportAdapter);
}
