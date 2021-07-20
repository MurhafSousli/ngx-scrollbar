import { Component } from '@angular/core';

@Component({
  selector: 'app-example5',
  templateUrl: './example5.component.html',
  styleUrls: ['./example5.component.scss'],
  host: {
    '[class.example-component]': 'true'
  }
})
export class Example5Component {
}
