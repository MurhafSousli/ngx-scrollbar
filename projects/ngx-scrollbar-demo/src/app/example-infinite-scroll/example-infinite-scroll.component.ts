import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Chance } from 'chance';

@Component({
  host: {
    '[class.example-component]': 'true'
  },
  selector: 'app-example-infinite-scroll',
  templateUrl: './example-infinite-scroll.component.html',
  styleUrl: './example-infinite-scroll.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, NgScrollbarModule, MatListModule, InfiniteScrollDirective]
})
export class ExampleInfiniteScrollComponent {
  chance: any = new Chance();
  array: any[] = [];
  sum: number = 100;
  direction: string = '';

  constructor() {
    this.appendItems(0, this.sum);
  }

  addItems(startIndex: number, endIndex: number, method: string) {
    for (let i: number = 0; i < this.sum; ++i) {
      this.array[method]([i, ' ', this.generateWord()].join(''));
    }
  }

  appendItems(startIndex, endIndex): void {
    this.addItems(startIndex, endIndex, 'push');
  }

  prependItems(startIndex, endIndex): void {
    this.addItems(startIndex, endIndex, 'unshift');
  }

  onScrollDown(): void {
    // add another 20 items
    const start: number = this.sum;
    this.sum += 20;
    this.appendItems(start, this.sum);

    this.direction = 'down';
  }

  onUp(): void {
    const start: number = this.sum;
    this.sum += 20;
    this.prependItems(start, this.sum);

    this.direction = 'up';
  }

  generateWord(): any {
    return this.chance.word();
  }

}
