import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarCdkVirtualScroll } from 'ngx-scrollbar/cdk';

@Component({
  host: {
    '[class.example-component]': 'true'
  },
  selector: 'app-example-virtual-scroll',
  templateUrl: './example-virtual-scroll.component.html',
  styleUrl: './example-virtual-scroll.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, NgScrollbarModule, ScrollingModule, MatListModule, NgScrollbarCdkVirtualScroll]
})
export class ExampleVirtualScrollComponent {

  items: number[] = Array.from({ length: 1000 }, (v, k) => k + 1);

}
