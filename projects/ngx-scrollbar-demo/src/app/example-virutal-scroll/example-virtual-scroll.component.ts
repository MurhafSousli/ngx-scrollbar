import { Component } from '@angular/core';

@Component({
  selector: 'app-example-virtual-scroll',
  templateUrl: './example-virtual-scroll.component.html',
  styleUrls: ['./example-virtual-scroll.component.scss'],
  host: {
    '[class.example-component]': 'true'
  }
})
export class ExampleVirtualScrollComponent {

  items = Array.from({ length: 1000 }, (v, k) => k + 1);

}
