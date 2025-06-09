## Reached & Dropped Events

The `NgScrollReachDrop` directive is an addon feature for the `NgScrollbar` component in Angular.

It provides reached outputs that emit when the scroll position reaches specific points within the scrollable content and dropped outputs that emit when the scroll position drops from specific points within the scrollable content.

### Usage

The `NgScrollReached` directive can be used by selecting one or more of the following output events:

- `(reachedTop)`
- `(reachedBottom)`
- `(reachedStart)`
- `(reachedEnd)`
- `(droppedTop)`
- `(droppedBottom)`
- `(droppedStart)`
- `(droppedEnd)`

**Example**

```ts
import { NgScrollbar } from 'ngx-scrollbar';
import { NgScrollReachDrop } from 'ngx-scrollbar/reached-event';

@Component({
  selector: 'example-component',
  template: `
    <ng-scrollbar (reachedBottom)="onBottomReached()">
      ...
    </ng-scrollbar>
  `,
  imports: [NgScrollbar, NgScrollReachDrop]
})
export class ExampleComponent {
}
```

### API

| Name                      | Description                                                         |
|---------------------------|---------------------------------------------------------------------|
| **(reachedTop)**          | A stream that emits when scroll has reached the top.                |
| **(reachedBottom)**       | A stream that emits when scroll has reached the bottom.             |
| **(reachedStart)**        | A stream that emits when scroll has reached the left (right in RTL) |
| **(reachedEnd)**          | A stream that emits when scroll has reached the right (left in RTL) |
| **[reachedTopOffset]**    | Reached top offset                                                  |
| **[reachedBottomOffset]** | Reached bottom offset                                               |
| **[reachedStartOffset]**  | Reached start offset                                                |
| **[reachedEndOffset]**    | Reached end offset                                                  |
| **[disableReached]**      | Disable the directive                                               |

| Name                      | Description                                                         |
|---------------------------|---------------------------------------------------------------------|
| **(droppedTop)**          | A stream that emits when scroll has dropped the top.                |
| **(droppedBottom)**       | A stream that emits when scroll has dropped the bottom.             |
| **(droppedStart)**        | A stream that emits when scroll has dropped the left (right in RTL) |
| **(droppedEnd)**          | A stream that emits when scroll has dropped the right (left in RTL) |
| **[droppedTopOffset]**    | Dropped top offset                                                  |
| **[droppedBottomOffset]** | Dropped bottom offset                                               |
| **[droppedStartOffset]**  | Dropped start offset                                                |
| **[droppedEndOffset]**    | Dropped end offset                                                  |
| **[disableDropped]**      | Disable the directive                                               |
