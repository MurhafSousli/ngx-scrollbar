import { Component, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'app-example-scrollto-element',
  templateUrl: './example-scrollto-element.component.html',
  styleUrls: ['./example-scrollto-element.component.scss'],
  host: {
    '[class.example-component]': 'true'
  }
})
export class ExampleScrolltoElementComponent {

  @ViewChild(NgScrollbar, { static: true }) scrollbar: NgScrollbar;

  scrollToItem(el: HTMLElement) {
    this.scrollbar.scrollToElement(el, { top: -125 });
  }
}
