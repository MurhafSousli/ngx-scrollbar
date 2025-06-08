import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgScrollbarMatSelect } from 'ngx-scrollbar/mat';
import { Chance } from 'chance';

@Component({
  selector: 'app-example-mat-select',
  imports: [
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    NgScrollbarMatSelect
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
