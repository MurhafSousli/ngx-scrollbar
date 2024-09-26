To override the default scrollbar options for all scrollbar components across the application, import the `provideScrollbarOptions` function in your providers, here is an example:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideScrollbarOptions } from 'ngx-scrollbar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideScrollbarOptions({
      visibility: 'hover',
      appearance: 'compact'
    })
  ]
};
```

## NgScrollbarOptions API


| Name                        | Default value   | Description                                                          |
| --------------------------- | --------------- | -------------------------------------------------------------------- |
| **orientation**             | `auto`          | The scroll axis of the viewport `auto`, `horizontal`, `vertical`.    |
| **position**                | `native`        | Invert scrollbar position `native`,`invertX`,`invertY`, `invertAll`. |
| **visibility**              | `native`        | Scrollbar visibility `native`, `hover`, `always`.                    |
| **appearance**              | `native`        | Scrollbar appearance `native`, `compact`.                            |
| **trackClass**              | *null*          | Add a class to scrollbar track elements.                             |
| **thumbClass**              | *null*          | Add a class to scrollbar thumbnail elements.                         |
| **buttonClass**             | *null*          | Add a class to scrollbar button elements.                            |
| **buttons**                 | false           | Show scrollbar buttons.                                              |
| **hoverOffset**             | false           | Activate hover effect on the offset area around the scrollbar.       |
| **trackClickDuration**      | 50              | The smooth scroll step duration when a scrollbar is clicked in ms.   |
| **minThumbSize**            | 20              | The minimum scrollbar thumb size in px.                              |
| **sensorThrottleTime**      | 0               | The throttle time used for detecting size changes.                   |
| **disableSensor**           | false           | Whether `ResizeObserver` is disabled.                                |
| **disableInteraction**      | false           | Disables scrollbar interaction like dragging thumb and jumping by track click.|

## Types aliases

### ScrollbarOrientation 

Sets the scroll axis of the viewport.
 - `auto`: Scrollbars are displayed for both vertical and horizontal scrolling.
 - `vertical`: Scrollbars are displayed for vertical scrolling.
 - `horizontal`: Scrollbars are displayed for horizontal scrolling.

Defaults to 'auto'.

```ts
type ScrollbarOrientation = 'auto' | 'vertical' | 'horizontal';
```

### ScrollbarAppearance

Sets the appearance of the scrollbar.
 - `native`: Scrollbar space is reserved within the viewport, similar to native scrollbars.
 - `compact`: Scrollbars do not reserve any space and are placed over the viewport.

Defaults to 'native'.

```ts
type ScrollbarAppearance = 'native' | 'compact';
```

### ScrollbarVisibility 

Determines when to show the scrollbar.
 - `native`: Scrollbar is visible when the viewport is scrollable, similar to native scrollbars.
 - `hover`: Scrollbars are hidden by default and become visible on scrolling or hovering.
 - `visible`: Scrollbars are always visible, even if the viewport is not scrollable.

Defaults to 'native'.

```ts
type ScrollbarVisibility = 'native' | 'hover' | 'visible';
```

### ScrollbarPosition

Sets the position of each scrollbar.
 - `native`: Uses the default position as in native scrollbars.
 - `invertY`: Inverts the vertical scrollbar position.
 - `invertX`: Inverts the horizontal scrollbar position.
 - `invertAll`: Inverts the positions of both vertical and horizontal scrollbars.

Defaults to 'native'.

```ts
type ScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll';
```
