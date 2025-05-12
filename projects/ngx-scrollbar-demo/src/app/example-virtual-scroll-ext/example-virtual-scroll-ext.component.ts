import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarCdkVirtualScroll } from 'ngx-scrollbar/cdk';

@Component({
  host: {
    '[class.example-component]': 'true'
  },
  selector: 'app-example-virtual-scroll-ext',
  templateUrl: './example-virtual-scroll-ext.component.html',
  styleUrl: './example-virtual-scroll-ext.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, NgScrollbarModule, ScrollingModule, MatListModule, NgScrollbarCdkVirtualScroll]
})
export class ExampleVirtualScrollExtComponent {
  items: string[] = Array.from({ length: 100 }).map((_, i) => `Item #${ i }`);
}
