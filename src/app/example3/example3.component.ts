import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-example3',
  templateUrl: './example3.component.html',
  styleUrls: ['./example3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Example3Component {
}
