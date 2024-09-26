To set global options for all scrollbar components across the app, provide the token `NG_SCROLLBAR_OPTIONS` with your custom options like in the following example:

```ts
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

@NgModule({
  imports: [
    NgScrollbarModule
  ],
  providers: [
    { 
       provide: NG_SCROLLBAR_OPTIONS,
       useValue: {
          // ... options
       }
    }
  ]
})
```

#### Global options API (`NgScrollbarOptions`)


| Name                        | Default value   | Description                                                          |
| --------------------------- | --------------- | -------------------------------------------------------------------- |
| **track**                   | `vertical`      | Directions to track `horizontal`, `vertical`, `all`                  |
| **position**                | `native`        | Invert scrollbar position `native`,`invertX`,`invertY`, `invertAll`  |
| **visibility**              | `native`        | Scrollbar visibility `native`, `hover`, `always`                     |
| **appearance**              | `compact`       | Scrollbar appearance `standard`, `compact`.                          |
| **viewClass**               | *null*          | Add custom class to the viewport element.                            |
| **trackClass**              | *null*          | Add custom class to scrollbar track elements.                        |
| **thumbClass**              | *null*          | Add custom class to scrollbar thumbnail elements.                    |
| **trackClickScrollDuration**| 300             | The smooth scroll duration when a scrollbar is clicked.              |
| **minThumbSize**            | 20              | The minimum scrollbar thumb size in px.                              |
| **scrollAuditTime**         | 0               | Throttle scroll event in ms.                                         |
| **windowResizeDebounce**    | 0               | Debounce interval for detecting changes via `window.resize` event.   |
| **sensorDebounce**          | 0               | Debounce interval for detecting changes via `ResizeObserver`.        |
| **sensorDisabled**          | false           | Whether `ResizeObserver` is disabled.                                |
| **pointerEventsMethod**     | `viewport`      | The method used to detect scrollbar pointer-events, [read more](pointer-events). |
| **pointerEventsDisabled**   | false           | Enable/disable the scrollbar track clicked and thumb dragged events. |
| **autoHeightDisabled**      | false            | Whether to set component height to content height.                   |
| **autoWidthDisabled**       | true            | Whether to set component width to content width.                     |
