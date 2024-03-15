import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ScrollbarX, ScrollbarY } from '../scrollbar/scrollbar';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';

@Component({
  standalone: true,
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
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class Scrollbars {
  cmp: _NgScrollbar = inject(NG_SCROLLBAR);
}
