import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [CommonModule, NgScrollbarModule, MatCardModule, MatButtonModule]
})
export class Example2Component {

  @ViewChild(NgScrollbar, { static: true }) scrollbar: NgScrollbar;

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
      title: 'Mow the law',
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
      title: 'Mow the law',
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
      title: 'Mow the law',
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

  onScrollbarUpdate() {
    this.scrollbar.scrollTo({ bottom: 0, duration: 200 });
  }
}
