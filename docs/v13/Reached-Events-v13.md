The reached event is an addon feature that extends `NgScrollbar` component via `NgScrollbarReachedModule`.

Once imported, reached outputs become available to use

### Usage

`NgScrollbarReachedModule` provides 4 standalone directives: 

- `(reachedTop)`
- `(reachedBottom)`
- `(reachedStart)`
- `(reachedEnd)`

When using any of the above directives, you will be able to set the offset using `[reachedOffset]` input.

**Example**

```ts
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';

@NgModule({
  imports: [
    NgScrollbarModule,
    NgScrollbarReachedModule
  ],
})
export class AppModule {
}
```
```html
<ng-scrollbar (reachedBottom)="onBottomReached()" [reachedOffset]="200">
  <div>{{scrollableContent}}</div>
</ng-scrollbar>
```
```ts
@Component({...})
export class FooComponent {
  onBottomReached() {
    console.log('Reached!');
  }
}
```


| Name                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| **(reachedTop)**            | A stream that emits when scroll has reached the top.                 |
| **(reachedBottom)**         | A stream that emits when scroll has reached the bottom.              |
| **(reachedStart)**          | A stream that emits when scroll has reached the left (right in RTL)  |
| **(reachedEnd)**            | A stream that emits when scroll has reached the right (left in RTL)  |
| **[reachedOffset]**         | reached offset, default 0                                            |