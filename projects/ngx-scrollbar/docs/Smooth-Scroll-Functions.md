The following smooth scroll function returns a promise that resolves when scrolling reaches the point or target

## Scroll to position

```ts
scrollable.scrollTo(options: SmoothScrollToOptions)
```

- **Element:** target HTMLElement, or ElementRef or the selector string.
- **Options:**
  - **Top:** Set top offset, default `null`.
  - **Bottom:** Set bottom offset, default `null`.
  - **Start:** Set start offset (evaluates left in ltr, in right rtl), default `null`.
  - **End:** Set end offset (evaluates right in ltr, in left rtl), default `null`.
  - **Left:** Set left offset, default `null`.
  - **Right:** Set right offset, default `null`.
  - **Duration:** Time to reach the target in ms, default `null`.
  - **Easing:** Smooth scroll animation can be customized using the bezier-easing properties `{ x1, y1, x2, y2 }`.

Avoid setting `top` and `bottom`, or `start` and `end`, or `left` and `right` at the same time because that would obviously not work.

## Scroll to element

```ts
scrollable.scrollToElement(target: HTMLElement | ElementRef | string, options?)
```

- **Element:** target HTMLElement, or ElementRef or the selector string.
- **Options:**
  - **Top:** Set top offset, default `null`.
  - **Bottom:** Set bottom offset, default `null`.
  - **Start:** Set start offset (evaluates left in ltr, in right rtl), default `null`.
  - **End:** Set end offset (evaluates right in ltr, in left rtl), default `null`.
  - **Left:** Set left offset, default `null`.
  - **Right:** Set right offset, default `null`.
  - **Center** Set the scroll position to the center of the target element, default: `false`
  - **Duration:** time to reach the position in milliseconds, default `null`.
  - **Easing:** Smooth scroll animation can be customized using the bezier-easing properties `{ x1, y1, x2, y2 }`.

## Scrolling examples

### Scroll to top directly from the template

```html
<ng-scrollbar #scrollbarRef="ngScrollbar">
  <!-- Content -->
</ng-scrollbar>

<button (click)="scrollbarRef.scrollTo({ top: 0 })">Go to top</button>
```

### Scroll to a specific element by a selector

```html
<ng-scrollbar #scrollable="ngScrollbar">
  <div id="..."></div>
  <div id="..."></div>
  <div id="..."></div>
  <div id="comments"></div>
  <div #footer></div>
</ng-scrollbar>

<button (click)="scrollable.scrollToElement('#comments')">Comments Section</button>

<button (click)="scrollable.scrollToElement(footer)">Scroll to footer</button>
```

### Scroll to a specific element by element reference

```html
<ng-scrollbar>
  <div #intro></div>
  <div #title></div>
  <div #body></div>
  <div #comments></div>
  <div #author></div>
</ng-scrollbar>

<button (click)="scrollable.scrollToElement(comments)">Comments Section</button>
```

The same can be done from component code using the `@ViewChild` decorator

```ts
@ViewChild(NgScrollbar) scrollable: NgScrollbar;
@ViewChild('comments') commentsSection: ElementRef;

scrollToCommentsSection() {
  this.scrollable.scrollToElement(this.commentsSection);
}
```


### Scroll to top on route change

If you wrap the `<router-outlet>` inside `<ng-scrollbar>`, you can scroll to the top on route changes.

The following example scrolls to top whenever the user navigates to another page.

```html
<ng-scrollbar>
  <router-outlet/>
</ng-scrollbar>
```

```ts
import { untracked } from '@angular/core';
import { Subscription } from 'rxjs';

export class AppComponent {

  scrollableComponent: Signal<NgScrollbar> = viewChild(NgScrollbar);

  constructor(router: Router) {
    let sub$: Subscription;
    
    effect((onCleanup) => {
      const scrollbar: NgScrollbar = this.scrollableComponent();
      untracked(() => {
        if (scrollbar) {
          sub$ = router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            tap((event: NavigationEnd) => scrollable.scrollTo({ top: 0, duration: 500 }))
          ).subscribe();
        }
        onCleanup(() => sub$?.unsubscribe())
      });
    });
  }
}
```
