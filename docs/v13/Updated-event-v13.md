The `NgScrollbar` component has an output `(updated)` which emits when:

- After its view is initialized
- Setting new options (_e.g. an input is changed)
- Resize sensor emitted (_e.g. the content size is changed_)

**Example:** Check when content becomes scrollable

```html
<ng-scrollbar #scrollbar="ngScrollbar" (updated)="onScrollbarUpdate(scrollbar.state)"></ng-scrollbar>
````

```ts
onScrollbarUpdated(state: NgScrollbarState) {
  if (state.isVerticallyScrollable) {
    console.log('Scrollable');
  } else {
    console.log('Not Scrollable');
  }
}
```

Here is a [demo stacbklitz](https://stackblitz.com/edit/ngx-scrollbar-f2qto9?file=src%2Fapp%2Fhome%2Fhome.component.ts)