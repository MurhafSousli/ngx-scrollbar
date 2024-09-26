## Installation

To install `ngx-scrollbar`, along with its dependency `@angular/cdk`, you can use **npm**:

```bash
npm i ngx-scrollbar @angular/cdk
```

## Usage

After installation, import `NgScrollbarModule` into your component imports:

```js
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    NgScrollbarModule
  ]
})
```

Then, in your component template, you can use the `<ng-scrollbar>` to wrap your content:

```html
<ng-scrollbar>
  <!-- content goes here -->
</ng-scrollbar>
```

### NgScrollbar API

`<ng-scrollbar>` has the following are the inputs / outputs:

| Name                                  | Default value | Description                                                                    |
|---------------------------------------|---------------|--------------------------------------------------------------------------------|
| **[orientation]**                     | `auto`        | The scroll axis of the viewport `horizontal`, `vertical`, `auto`.              |
| **[position]**                        | `native`      | Invert scrollbar position `native`,`invertX`,`invertY`, `invertAll`.           |
| **[visibility]**                      | `native`      | Scrollbar visibility `native`, `hover`, `always`.                              |
| **[appearance]**                      | `standard`    | Scrollbar appearance `standard`, `compact`.                                    |
| **[trackClass]**                      | *null*        | Add a class to scrollbars' tracks.                                             |
| **[thumbClass]**                      | *null*        | Add a class to scrollbars' thumbnails.                                         |
| **[buttonClass]**                     | *null*        | Add a class to scrollbar button elements.                                      |
| **[buttons]**                         | false         | Show scrollbar buttons.                                                        |
| **[hoverOffset]**                     | false         | Activate hover effect on the offset area around the scrollbar.                 |
| **[trackClickDuration]**              | 50            | The smooth scroll step duration when a scrollbar is clicked in ms.             |
| **[minThumbSize]**                    | 20            | The minimum scrollbar thumb size in px.                                        |
| **[sensorThrottleTime]**              | 0             | The throttle time used for detecting size changes.                             |
| **[disableSensor]**                   | false         | Whether `ResizeObserver` is disabled.                                          |
| **[disableInteraction]**              | false         | Disables scrollbar interaction like dragging thumb and jumping by track click. |
| **(afterInit)**                       |               | Output that emits after the scrollbar component is initialized.                |
| **(afterUpdate)**                     |               | Output that emits after the scrollbar component is updated.                    |
| **update()**                          |               | Trigger a re-calculation to update the scrollbar.                              |
| **scrollTo(options)**                 |               | Scroll function that returns a promise that resolves when scroll is reached.   |
| **scrollToElement(target, options?)** |               | Scroll function that returns a promise that resolves when scroll is reached.   |

---

## Advanced usage: select a custom viewport element

The `externalViewport` directve allows you to designate another element as the viewport, you can select an external
viewport using the `scrollViewport` directive.

#### Example using `scrollViewport` directive:

```html
<ng-scrollbar externalViewport>
  <div scrollViewport>
    <!-- content goes here -->
  </div>
</ng-scrollbar>
```

If viewport element is inaccessible from the template, you can pass its selector as the directive value
`[externalViewport]=".my-custom-viewport"`.

#### Example of passing viewport selector:

```html
<ng-scrollbar externalViewport=".my-custom-viewport">
  <div class="my-custom-viewport">
    <!-- content goes here -->
  </div>
</ng-scrollbar>
```

By default a content wrapper element will be created inside the viewport to hold its content. optionally, you can select
a custom content wrapper using the input `[externalContentWrapper]`

#### Example of passing content wrapper selector:

```html
<ng-scrollbar externalViewport=".my-custom-viewport"
              externalContentWrapper=".my-custom-content-wrapper">
  <div class="my-custom-viewport">
    <div class="my-custom-content-wrapper">
      <!-- content goes here -->
    </div>
  </div>
</ng-scrollbar>
```

This capability enables integration of the scrollbar with 3rd-party libraries where the viewport or content wrapper
elements are inaccessible from the template.

### NgScrollbarExt API

`<ng-scrollbar externalViewport>` extends `<ng-scrollbar>` with the following inputs:

| Name                         | Default value | Description                                                                                                                                  |
|------------------------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **[externalViewport]**       | *null*        | External viewport selector.                                                                                                                  |
| **[externalContentWrapper]** | *null*        | External content wrapper selector.                                                                                                           |
| **[externalSpacer]**         | *null*        | External spacer selector used for calculating content dimensions instead of using the content wrapper (useful for virtual scroll libraries). |

### NgScrollbarExt + Async Detection directive

The `AsyncDetection` directive is an addon for the `<ng-scrollbar externalViewport>` component. It is particularly
useful when integrating with third-party libraries where the viewport and its content may not be rendered at the time
the scrollbar component is created. This directive detects the viewport and content wrapper, attaching the scrollbar
as soon as they are rendered.

In contrast, you should use `asyncDetection="auto"` when the target viewport may be destroyed and recreated,
such as in the case of a dropdown menu.

### NgScrollbarExt + Sync Spacer directive

The syncSpacer directive is an addon for the <ng-scrollbar externalViewport> component. It is particularly useful when
integrating with a virtual scroll component, ensuring that both scrollbars are displayed correctly.
