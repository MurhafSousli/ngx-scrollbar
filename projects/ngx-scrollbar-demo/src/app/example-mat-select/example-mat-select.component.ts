import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgScrollbarMatSelectViewport } from 'ngx-scrollbar/utils';
import { Chance } from 'chance';

@Component({
  selector: 'app-example-mat-select',
  standalone: true,
  imports: [
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgScrollbar,
    MatCardModule,
    NgScrollbarMatSelectViewport
  ],
  templateUrl: './example-mat-select.component.html',
  styleUrl: './example-mat-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleMatSelectComponent {

  chance = new Chance();

  items = [
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
    this.chance.sentence({ words: 5 }),
  ];
}
