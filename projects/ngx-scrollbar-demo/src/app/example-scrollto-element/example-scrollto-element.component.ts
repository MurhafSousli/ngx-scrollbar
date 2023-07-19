import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-example-scrollto-element',
  templateUrl: './example-scrollto-element.component.html',
  styleUrls: ['./example-scrollto-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  },
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgScrollbarModule, CommonModule]
})
export class ExampleScrolltoElementComponent {

  @ViewChild(NgScrollbar, { static: true }) scrollbar: NgScrollbar;

  scrollToItem(el: HTMLElement) {
    this.scrollbar.scrollToElement(el, { top: -125 });
  }
}
