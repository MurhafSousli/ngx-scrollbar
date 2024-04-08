import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarCdkVirtualScroll } from 'ngx-scrollbar/cdk';

@Component({
  selector: 'app-example-virtual-scroll',
  templateUrl: './example-virtual-scroll.component.html',
  styleUrls: ['./example-virtual-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [MatCardModule, NgScrollbarModule, ScrollingModule, MatListModule, NgScrollbarCdkVirtualScroll]
})
export class ExampleVirtualScrollComponent {

  items: number[] = Array.from({ length: 1000 }, (v, k) => k + 1);

}
