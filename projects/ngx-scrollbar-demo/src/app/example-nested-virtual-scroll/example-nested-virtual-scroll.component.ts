import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarCdkVirtualScroll } from 'ngx-scrollbar/utils';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-example-nested-virtual-scroll',
  templateUrl: './example-nested-virtual-scroll.component.html',
  styleUrls: ['./example-nested-virtual-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [
    MatCardModule,
    NgScrollbarModule,
    ScrollingModule,
    CardComponent,
    MatSelectModule,
    NgScrollbarCdkVirtualScroll
  ]
})
export class ExampleNestedVirtualScrollComponent {

  items: number[] = Array.from({ length: 1000 }, (v, k) => k + 1);
  horizontal: number[] = Array.from({ length: 100 }, (v, k) => k + 1);

}
