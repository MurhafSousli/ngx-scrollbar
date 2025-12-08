When working with third-party libraries or other components where you cannot modify the HTML template, you can dynamically attach a scrollbar using the `NgScrollbarAnywhere` service. This service uses CSS selectors to target the desired element and apply the scrollbar.

**Example:** 

```ts
import { NgScrollbarAnywhere, NgScrollbar, NgScrollbarRef } from 'ngx-scrollbar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  scrollbarAnywhere = inject(NgScrollbarAnywhere);

  scrollbarRef: NgScrollbarRef<NgScrollbar>;

  createScrollbar(): void {
    this.scrollbarRef = this.scrollbarAnywhere.createScrollbar('#viewport-host');
  }
}
```

**Example:**

```ts
import { NgScrollbarAnywhere, NgScrollbarExt, NgScrollbarRef } from 'ngx-scrollbar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  scrollbarAnywhere = inject(NgScrollbarAnywhere);

  scrollbarRef: NgScrollbarRef<NgScrollbarExt>;

  createScrollbar(): void {
    this.scrollbarRef = this.scrollbarAnywhere.createScrollbar({
      host: '#host-element',
      viewport: '#my-viewport',
      contentWrapper: '#my-content-wrapper',
    });
  }
}
```
