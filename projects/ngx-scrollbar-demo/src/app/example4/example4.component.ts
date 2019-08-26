import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-example4',
  templateUrl: './example4.component.html',
  styleUrls: ['./example4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  }
})
export class Example4Component {
}
