import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { Chance } from 'chance';

@Component({
  selector: 'app-example-scrollto-element',
  standalone: true,
  imports: [NgScrollbarModule, MatButtonModule],
  templateUrl: './example-scrollto-element.component.html',
  styleUrl: './example-scrollto-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleScrolltoElementComponent implements OnInit {

  scrollbarRef: NgScrollbar = inject(NgScrollbar);

  chance = new Chance();

  groups: number[] = [1, 2, 3, 4];

  sections: number[] = [1, 2, 3, 4];

  text: string[][] = [];

  ngOnInit(): void {
    this.groups.forEach((group: number, i: number) => {
      this.text[i] = [];
      this.sections.forEach((section: number) => {
        this.text[i].push(this.chance.paragraph({ sentences: 10 }));
      });
    });
  }

  goToSection(group: number, section: number): void {
    this.scrollbarRef.scrollToElement(`#group-${ group }-section-${ section }`, { top: -75, duration: 700 });
  }
}
