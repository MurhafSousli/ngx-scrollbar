import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  host: {
    '[class.example-component]': 'true'
  },
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrl: './example2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgScrollbarModule, MatCardModule, MatButtonModule]
})
export class Example2Component {

  @ViewChild(NgScrollbarExt, { static: true }) scrollbar: NgScrollbarExt;

  list = [
    {
      title: 'Morning Exercise',
      completed: false
    },
    {
      title: 'Healthy Breakfast',
      completed: true
    },
    {
      title: 'Email Check',
      completed: false
    },
    {
      title: 'Plan the Day',
      completed: true
    },
    {
      title: 'Work on Project',
      completed: true
    },
    {
      title: 'Lunch Break',
      completed: false
    },
    {
      title: 'Learn Something',
      completed: true
    },
    {
      title: 'Organize Workspace',
      completed: false
    },
    {
      title: 'Evening Relaxation',
      completed: true
    },
    {
      title: 'Go to gym',
      completed: true
    },
    {
      title: 'Household Chores',
      completed: false
    },
    {
      title: 'Take Out The Trash',
      completed: true
    },
    {
      title: 'Grocery Shopping',
      completed: false
    },
    {
      title: 'Check Finances',
      completed: true
    },
    {
      title: 'Creative Time',
      completed: true
    },
    {
      title: 'Review Goals',
      completed: false
    },
    {
      title: 'Outdoor Activity',
      completed: true
    }
  ];

  addItem() {
    this.list = [
      ...this.list, ...[
        {
          title: 'Reflect on Your Day',
          completed: false
        }
      ]
    ];
  }

  onScrollbarUpdate(scrollbarRef: NgScrollbarExt, duration: number = 0): void {
    scrollbarRef.scrollTo({ bottom: 0, duration });
  }
}
