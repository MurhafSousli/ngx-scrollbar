The appearance of the custom scrollbar can be entirely tailored by overriding specific CSS variables. This is best done using the provided SCSS mixin, which ensures the styles are applied correctly across the component structure.

### Using the SCSS Mixin

The recommended way to apply these overrides globally is by using the @include scrollbar.ng-scrollbar-overrides(...) mixin within a global style file (e.g., styles.scss).

```scss
@use 'ngx-scrollbar' as scrollbar;

:root {
  @include scrollbar.ng-scrollbar-overrides((
    track-color: rgb(0 0 0 / 30%),
    track-thickness: 18px,
    track-hover-thickness: 24px,
    thumb-min-size: 20px,
    track-offset: 5px,
  ));
}
```


| Name                                      | Default Value     | Description                                              |
|-------------------------------------------|-------------------|----------------------------------------------------------|
| `container-color`                         |                   | Set the scrollbar container color                        |
| `container-offset`                        | 0px               | Set the gutter between the outer container and the edge  |
| `container-shape`                         | 0px               | Set the border radius of the scrollbar track container   |
| `track-shape`                             | 10px              | Adjust the border radius of the scrollbar track          |
| `track-thickness`                         | 7px               | Track thickness                                          |
| `track-hover-thickness`                   |                   | Track hover thickness                                    |
| `track-active-thickness`                  |                   | Track active thickness                                   |
| `track-offset`                            | 4px               | Set the gutter between the inner track and the scrollbar |
| `track-color`                             |                   | Scrollbar track color                                    |
| `thumb-size`                              |                   | Set a fixed thumb size                                   |
| `thumb-min-size`                          | 20px              | Set minimum thumb size                                   | 
| `thumb-color`                             | rgb(0 0 0 / 40%)  | Set scrollbar thumb color                                |                  
| `thumb-hover-color`                       |                   | Set scrollbar thumb hover color                          |                  
| `thumb-active-color`                      |                   | Set scrollbar thumb active color                         |
| `hover-opacity-transition-enter-duration` | 0                 | Hover effect transition enter duration                   |
| `hover-opacity-transition-leave-duration` | 0.4s              | Hover effect transition leave duration                   |
| `hover-opacity-transition-leave-delay`    | 1s                | Hover effect transition enter delay                      |
| `overscroll-behavior`                     | initial           | Adjust Overscroll behavior                               |
| `mobile-overscroll-behavior`              | none              | Adjust Overscroll behavior on Mobile browsers            |
| `button-gap`                              | 0px               | The space between the button and the track               |
| `button-shape`                            | 0px               | Scrollbar buttons border radius                          |
| `button-size`                             |                   | Scrollbar buttons dimension                              |
| `button-color`                            |                   | Scrollbar buttons color                                  |
| `button-hover-color`                      |                   | Scrollbar buttons hover color                            |
| `button-active-color`                     |                   | Scrollbar buttons active color                           |
| `button-inactive-color`                   |                   | Scrollbar buttons inactive color (disabled)              |
| `button-fill-color`                       |                   | Scrollbar buttons arrow color                            |
| `button-fill-hover-color`                 |                   | Scrollbar buttons arrow hover color                      |
| `button-fill-active-color`                |                   | Scrollbar buttons arrow active color                     |
| `button-fill-inactive-color`              |                   | Scrollbar buttons arrow inactive color (disabled)        |


### Direct CSS Variable Overrides (Legacy method)

If you want to directly set the CSS variable, add `--scrollbar-` before the property from the table above.

```scss
.special-scrollbar {
  --scrollbar-track-thickness: 12px;
  --scrollbar-track-hover-thickness: 16px;
}
```
