import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-example5',
  templateUrl: './example5.component.html',
  styleUrls: ['./example5.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [MatCardModule, NgScrollbarModule]
})
export class Example5Component {
}
