Smooth scroll feature is built-in `NgScrollbar` component, but if you like to use this feature outside `NgScrollbar` component, then use `SmoothScroll`directive which is available independently and it allows you to use smooth scroll functions on any scrollable element.

The package provides: 

- `SmoothScroll` a directive for template usage
- `SmoothScrollManager` a service for code usage


### Directive Usage

Import `SmoothScroll` in your component the use the directive on your scrollable element

```ts
@Component({
  standalone: true,
  selector: 'my-app',
  imports: [SmoothScroll],
  template: `
    <div smoothScroll #scrollable="smoothScroll" class="scrollable-container">
      <div>{{scrollableContent}}</div>
    </div>

    <button (click)="scrollable.scrollTo({ bottom: 0, duration: 500 })">Scroll to bottom</button>
  `
})
```


### Service Usage

```ts
@Component({...})
export class FooComponent {
  
  // A reference to the smooth scroll service
  readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  // A reference to a scrollable element (in this example it is the host element)
  readonly scrollableElement: HTMLElement = inject(ElementRef).nativeElement;
  
  scrollToTop(): void {
    this.smoothScroll.scrollTo(this.scrollableElement, { top: 0, duration: 800 });
  }
}
```

See all [ScrollTo Functions](Smooth-Scroll-Functions.md).
