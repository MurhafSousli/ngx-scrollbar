import { ChangeDetectionStrategy, Component, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollReached } from 'ngx-scrollbar/reached-event';

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [CommonModule, NgScrollbarModule, NgScrollReached, MatCardModule, MatButtonModule]
})
export class Example2Component {

  @ViewChild(NgScrollbarExt, { static: true }) scrollbar: NgScrollbarExt;

  list = [
    {
      title: 'Clean the house',
      completed: false
    },
    {
      title: 'Take out the thrash',
      completed: true
    },
    {
      title: 'Do the dishes',
      completed: false
    },
    {
      title: 'Feed the dog',
      completed: true
    },
    {
      title: 'Go to gym',
      completed: true
    },
    {
      title: 'Clean the house',
      completed: false
    },
    {
      title: 'Take out the thrash',
      completed: true
    },
    {
      title: 'Do the dishes',
      completed: false
    },
    {
      title: 'Feed the dog',
      completed: true
    },
    {
      title: 'Go to gym',
      completed: true
    },
    {
      title: 'Clean the house',
      completed: false
    },
    {
      title: 'Take out the thrash',
      completed: true
    },
    {
      title: 'Do the dishes',
      completed: false
    },
    {
      title: 'Feed the dog',
      completed: true
    },
    {
      title: 'Go to gym',
      completed: true
    },
    {
      title: 'Clean the house',
      completed: false
    },
    {
      title: 'Have a beer',
      completed: true
    }
  ];

  addItem() {
    this.list = [
      ...this.list, ...[
        {
          title: 'Clean the house',
          completed: false
        }
      ]
    ];
  }

  onScrollbarUpdate(scrollbarRef: NgScrollbarExt, duration: number = 0): void {
    scrollbarRef.scrollTo({ bottom: 0, duration });
  }
}
