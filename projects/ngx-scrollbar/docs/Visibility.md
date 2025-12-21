### Visibility on hover addon

The `visibleOnScroll` directive enhances `<ng-scrollbar>` when using `visibility="hover"`.

#### Overview

By default, the hover mode only shows scrollbars when the mouse enters the container. This creates a poor experience for users scrolling via keyboard, touchpads, or scripts.
This directive bridges that gap by monitoring scroll activity and showing the scrollbars.

#### Usage

Simply add the `visibleOnScroll` directive to your scrollbar component:

```html
<ng-scrollbar visibility="hover" visibleOnScroll>
    ...
</ng-scrollbar>
```

The directive comes with two options:

- `scrollThrottleTime`: Limits the scroll observer stream, defaults to `200`ms.

- `scrollHideDelay`: The duration the scrollbar remains visible after the last scroll event is detected, defaults to `400`ms.


```html
<ng-scrollbar visibility="hover"
              visibleOnScroll
              scrollHideDelay="500"
              scrollThrottleTime="100">
  ...
</ng-scrollbar>
```
