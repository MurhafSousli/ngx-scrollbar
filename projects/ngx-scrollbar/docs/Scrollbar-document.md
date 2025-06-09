The `NgScrollbarDocument` service is used to attach scrollbar on the root document element.

```ts
import { Component, inject, afterNextRender } from '@angular/core';
import { NgScrollbarDocument } from 'ngx-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  scrollbarDocument = inject(NgScrollbarDocument);
  
  constructor() {
    afterNextRender({
      earlyRead: () => {
        this.scrollbarDocument.attachScrollbar();
      }
    });
  }
}
```
