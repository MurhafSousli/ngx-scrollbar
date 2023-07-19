import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Chance } from 'chance';

@Component({
  selector: 'app-example-infinite-scroll',
  templateUrl: './example-infinite-scroll.component.html',
  styleUrls: ['./example-infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [MatCardModule, NgScrollbarModule, InfiniteScrollModule, MatListModule, CommonModule]
})
export class ExampleInfiniteScrollComponent {
  chance = new Chance();
  array = [];
  sum = 100;
  direction = '';

  constructor() {
    this.appendItems(0, this.sum);
  }

  addItems(startIndex, endIndex, method) {
    for (let i = 0; i < this.sum; ++i) {
      this.array[method]([i, ' ', this.generateWord()].join(''));
    }
  }

  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'push');
  }

  prependItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'unshift');
  }

  onScrollDown(ev) {
    console.log('scrolled down!!', ev);

    // add another 20 items
    const start = this.sum;
    this.sum += 20;
    this.appendItems(start, this.sum);

    this.direction = 'down';
  }

  onUp(ev) {
    console.log('scrolled up!', ev);
    const start = this.sum;
    this.sum += 20;
    this.prependItems(start, this.sum);

    this.direction = 'up';
  }

  generateWord() {
    return this.chance.word();
  }

}
