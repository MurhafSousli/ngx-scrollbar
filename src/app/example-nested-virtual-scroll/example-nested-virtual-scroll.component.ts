import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-example-nested-virtual-scroll',
  templateUrl: './example-nested-virtual-scroll.component.html',
  styleUrls: ['./example-nested-virtual-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleNestedVirtualScrollComponent {

  items = Array.from({length: 1000}, (v, k) => k + 1);
  horizontal = Array.from({length: 100}, (v, k) => k + 1);

}
