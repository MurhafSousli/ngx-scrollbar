import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  host: {
    '[class.ng-scroll-content]': 'true'
  },
  selector: 'ng-scroll-content',
  template: '<ng-content/>',
  styles: [`
    /** Make sure content is positioned relatively so scrollbars can be sticky */
    :host {
      position: relative;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarContent {
}
