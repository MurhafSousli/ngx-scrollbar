import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  host: {
    '[class.ng-scroll-content]': 'true'
  },
  selector: 'ng-scroll-content',
  template: '<ng-content/>',
  styleUrl: 'scroll-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollContent {
}
