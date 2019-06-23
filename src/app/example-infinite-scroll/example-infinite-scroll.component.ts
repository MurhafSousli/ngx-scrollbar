import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Chance } from 'chance';
@Component({
  selector: 'app-example-infinite-scroll',
  templateUrl: './example-infinite-scroll.component.html',
  styleUrls: ['./example-infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleInfiniteScrollComponent {
  chance = new Chance();
  array = [];
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';

  constructor() {
    this.appendItems(0, this.sum);
  }

  addItems(startIndex, endIndex, _method) {
    for (let i = 0; i < this.sum; ++i) {
      this.array[_method]([i, ' ', this.generateWord()].join(''));
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
