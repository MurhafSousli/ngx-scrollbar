It was intentional not to provide a scroll event output on `NgScrollbar` component because it would cause the change detection to fire very rapidly which would cause a performance issue.

To use the scroll event, you will need to get the component reference from the template. this can be done using the `@ViewChild` decorator

**Example:** Subscribe to the scroll event

```ts
@ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

ngAfterViewInit() {
  this.scrollbarRef.scrolled.subscribe(e => console.log(e));
}
```

 > Note: in order to avoid hitting change detection for every scroll event, all of the events emitted from this stream will be run outside the Angular zone. If you need to update the UI using the scroll event, you should to run your code inside the Angular zone, `NgZone.run(() => )`.


### Example: Change the header font size on scroll event


```ts
@Component({
  selector: 'app-page-title',
  template: `
    <ng-scrollbar>
      <div class="page-title" [style.fontSize]="fontSize$ | async">
        <h1>Hello World</h1>
      </div>  
      <div>{{ longContent }}</div>
    </ng-scrollbar>
  `
})
export class PageTitleComponent {

  // Stream that sets the title font size on scroll event
  fontSize$ = new Subject();

  // Unsubscriber for elementScrolled stream.
  scrollSubscription = Subscription.EMPTY;

  // Get scrollbar component reference
  @ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;
  
  constructor(private zone: NgZone) {
  }
  
  ngAfterViewInit() {
    // Subscribe to scroll event
    this.scrollSubscription = this.scrollbarRef.scrolled.pipe(
      map((e: any) => e.target.scrollTop > 50 ? '0.75em' : '1em'),
      tap((size: string) => this.zone.run(() => this.fontSize$.next(size)))
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
  }
}
```

Here is the [example demo stackblitz](https://stackblitz.com/edit/ngx-scrollbar?file=src%2Fapp%2Fscroll-event%2Fscroll-event%2Fscroll-event.component.ts)
