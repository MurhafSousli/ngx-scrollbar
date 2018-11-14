import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-example5',
  templateUrl: './example5.component.html',
  styleUrls: ['./example5.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Example5Component {
}
