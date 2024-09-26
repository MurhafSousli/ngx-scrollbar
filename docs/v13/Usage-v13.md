
## Installation

Install with **npm**

```bash
npm i ngx-scrollbar@13 @angular/cdk
```

## Usage

Import `NgScrollbarModule` in your module

```js
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    NgScrollbarModule
  ]
})
```

In your template

```html
<!-- By default, height should be set on the component manually -->
<ng-scrollbar style="height: 300px">
  <!-- ... -->
</ng-scrollbar>

<!-- Automatically set the height to fit the content -->
<ng-scrollbar autoHeightDisabled="false">
  <!-- ... -->
</ng-scrollbar>
```

- Try it online using this [ngx-scrollbar v13 stackblitz example](https://stackblitz.com/edit/ngx-scrollbar-v13)

If you need to get hold of the scrollable element of the component, you can add a child element and then assign it with `scrollViewport` directive

```html
<ng-scrollbar>
  <div scrollViewport>
     <!-- CONTENT -->
  </div>
</ng-scrollbar>
```

## Options

> You can set global options for all scrollbars across your app, see the [global options](global-options) chapter.

The following are the available inputs and outputs of `<ng-scrollbar>`

| Name                           | Default value   | Description                                                         |
| ------------------------------ | --------------- | ------------------------------------------------------------------- |
| **[track]**                    | `vertical`      | Directions to track `horizontal`, `vertical`, `all`                 |
| **[position]**                 | `native`        | Invert scrollbar position `native`,`invertX`,`invertY`, `invertAll` |
| **[visibility]**               | `native`        | Scrollbar visibility `native`, `hover`, `always`                    |
| **[appearance]**               | `compact`       | Scrollbar appearance `standard`, `compact`.                         |
| **[viewClass]**                | *null*          | Add custom class to the viewport.                                   |
| **[trackClass]**               | *null*          | Add custom class to scrollbars' tracks.                             |
| **[thumbClass]**               | *null*          | Add custom class to scrollbars' thumbnails.                         |
| **[disabled]**                 | `false`         | Disable the custom scrollbars and use the native ones instead.      |
| **[trackClickScrollDuration]** | 300             | The smooth scroll duration when a scrollbar is clicked.             |
| **[minThumbSize]**             | 20              | The minimum scrollbar thumb size in px.                             |
| **[scrollAuditTime]**          | 0               | Throttle scroll event in ms.                                        |
| **[sensorDebounce]**           | 0               | Debounce interval for detecting changes via `ResizeObserver`.       |
| **[sensorDisabled]**           | false           | Whether `ResizeObserver` is disabled.                               |
| **[pointerEventsMethod]**      | `viewport`      | The method used to detect scrollbar pointer-events, [read more](https://github.com/MurhafSousli/ngx-scrollbar/wiki/pointer-events). |
| **[pointerEventsDisabled]**    | false           | Enable/disable the scrollbar track clicked and thumb dragged events.|
| **[autoHeightDisabled]**       | true            | Whether to set component height to content height.                  |
| **[autoWidthDisabled]**        | true            | Whether to set component width to content width.                    |
| **(updated)**                  | -               | Output that emits when the scrollbar component is updated.          |

