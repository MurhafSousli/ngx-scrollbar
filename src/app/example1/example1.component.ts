import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Example1Component {
  expanded = true;
  disabled = false;
}
