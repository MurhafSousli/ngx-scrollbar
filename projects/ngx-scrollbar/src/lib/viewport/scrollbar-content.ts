import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  host: {
    '[class.ng-scroll-content]': 'true'
  },
  selector: 'scroll-content',
  template: '<ng-content/>',
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarContent {
}
