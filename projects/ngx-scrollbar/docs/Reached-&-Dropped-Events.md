## Reached Events

The `NgScrollReached` directive is an addon feature for the `NgScrollbar` component in Angular. It emits events when the scroll position reaches specific points within the scrollable content.

### Usage

The `NgScrollReached` directive can be used by selecting one or more of the following output events:

- `(reachedTop)`
- `(reachedBottom)`
- `(reachedStart)`
- `(reachedEnd)`

**Example**

```ts
import { NgScrollbar } from 'ngx-scrollbar';
import { NgScrollReached } from 'ngx-scrollbar/reached-event';

@Component({
  standalone: true,
  selector: 'example-component',
  template: `
    <ng-scrollbar (reachedBottom)="onBottomReached()">
      ...
    </ng-scrollbar>
  `,
  imports: [NgScrollbar, NgScrollReached],
})
export class ExampleComponent {
}
```

### API

| Name                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| **(reachedTop)**            | A stream that emits when scroll has reached the top.                 |
| **(reachedBottom)**         | A stream that emits when scroll has reached the bottom.              |
| **(reachedStart)**          | A stream that emits when scroll has reached the left (right in RTL)  |
| **(reachedEnd)**            | A stream that emits when scroll has reached the right (left in RTL)  |
| **[reachedOffset]**         | Reached offset, default 0                                            |
| **[reachedTopOffset]**      | Reached top offset, falls back to `reachedOffset` value              |
| **[reachedBottomOffset]**   | Reached bottom offset, falls back to `reachedOffset` value           |
| **[reachedStartOffset]**    | Reached start offset, falls back to `reachedOffset` value            |
| **[reachedEndOffset]**      | Reached end offset, falls back to `reachedOffset` value              |
| **[disableReached]**        | Disable the directive, default false                                 |

## Dropped Events

The `NgScrollDropped` directive is an addon feature for the `NgScrollbar` component in Angular. It emits events when the scroll position drops from specific points within the scrollable content.

### Usage

The `NgScrollDropped` directive can be used by selecting one or more of the following output events:

- `(droppedTop)`
- `(droppedBottom)`
- `(droppedStart)`
- `(droppedEnd)`

**Example**

```ts
import { NgScrollbar } from 'ngx-scrollbar';
import { NgScrollDropped } from 'ngx-scrollbar/reached-event';

@Component({
  standalone: true,
  selector: 'example-component',
  template: `
    <ng-scrollbar (droppedTop)="onTopDropped()">
      ...
    </ng-scrollbar>
  `,
  imports: [NgScrollbar, NgScrollDropped],
})
export class ExampleComponent {
}
```

### API

| Name                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| **(droppedTop)**            | A stream that emits when scroll has dropped the top.                 |
| **(droppedBottom)**         | A stream that emits when scroll has dropped the bottom.              |
| **(droppedStart)**          | A stream that emits when scroll has dropped the left (right in RTL)  |
| **(droppedEnd)**            | A stream that emits when scroll has dropped the right (left in RTL)  |
| **[droppedOffset]**         | Dropped offset, default 0                                            |
| **[droppedTopOffset]**      | Dropped top offset, falls back to `droppedOffset` value              |
| **[droppedBottomOffset]**   | Dropped bottom offset, falls back to `droppedOffset` value           |
| **[droppedStartOffset]**    | Dropped start offset, falls back to `droppedOffset` value            |
| **[droppedEndOffset]**      | Dropped end offset, falls back to `droppedOffset` value              |
| **[disableDropped]**        | Disable the directive, default false                                 |
