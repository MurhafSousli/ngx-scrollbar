import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ScrollbarX, ScrollbarY } from '../scrollbar/scrollbar';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';

@Component({
  selector: 'scrollbars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollbarX, ScrollbarY],
  template: `
    <ng-content/>
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
