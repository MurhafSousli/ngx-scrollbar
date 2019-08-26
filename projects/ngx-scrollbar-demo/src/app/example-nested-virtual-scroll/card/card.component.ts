import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="app-card-content">
      [ {{ y }} , {{ x }} ]
    </div>
  `,
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  @Input() x: number;
  @Input() y: number;

}
