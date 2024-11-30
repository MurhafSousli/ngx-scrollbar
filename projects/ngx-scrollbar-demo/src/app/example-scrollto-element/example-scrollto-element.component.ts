import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Chance } from 'chance';
import { OverviewContentComponent } from './overview-content/overview-content.component';
import { ScrollContent } from './scroll-content.directive';
import { ScrollAnchor } from './scroll-anchor.directive';

@Component({
  selector: 'app-example-scrollto-element',
  templateUrl: './example-scrollto-element.component.html',
  styleUrl: './example-scrollto-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    OverviewContentComponent,
    ScrollContent,
    ScrollAnchor
  ]
})
export class ExampleScrolltoElementComponent implements OnInit {

  readonly chance = new Chance();

  readonly groups: number[] = [1, 2, 3, 4];

  readonly sections: number[] = [1, 2, 3, 4];

  readonly text: string[][] = [];

  ngOnInit(): void {
    this.groups.forEach((group: number, i: number) => {
      this.text[i] = [];
      this.sections.forEach((section: number) => {
        this.text[i].push(this.chance.paragraph({ sentences: 10 }));
      });
    });
  }
}
