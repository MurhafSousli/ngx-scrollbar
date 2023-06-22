import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from './card/card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-example-nested-virtual-scroll',
  templateUrl: './example-nested-virtual-scroll.component.html',
  styleUrls: ['./example-nested-virtual-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [MatCardModule, NgScrollbarModule, ScrollingModule, CardComponent]
})
export class ExampleNestedVirtualScrollComponent {

  items = Array.from({ length: 1000 }, (v, k) => k + 1);
  horizontal = Array.from({ length: 100 }, (v, k) => k + 1);

}
