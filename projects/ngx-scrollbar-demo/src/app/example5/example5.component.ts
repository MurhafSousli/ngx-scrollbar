import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  host: {
    '[class.example-component]': 'true'
  },
  selector: 'app-example5',
  templateUrl: './example5.component.html',
  styleUrls: ['./example5.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, NgScrollbarModule]
})
export class Example5Component {
}
