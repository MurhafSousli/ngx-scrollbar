# Migration guide from v4 to v5

## 1. Options

- Before
  - `compact="true | false"`
  - `trackX="true | false"`
  - `trackY="true | false"`
  - `shown="hover | always | native"`
  - `disableOnBreakpoints="[Handset] | false"`

- After
  - `appearence="standard | compact"` in favor of `compact`.
  - `direction="vertical | horizontal | both"` in favor of `trackX` and `trackY`.
  - `visibility="hover | always | native"` in favor of `shown`.
  - `position="native | invertX | invertY | invertAll"` in favor of `invertX` and `invertY`.
  - `disableOnBreakpoints="cdkBreakpoints | "unset"` to turn it off use `"unset"` instead of `false`.

### Available Inputs / Outputs

#### API v4

| Name                       | Default value   | Description                                                    |
| -------------------------- | --------------- | -------------------------------------------------------------- |
| **[trackX]**               | `false`         | Horizontal scrollbar                                           |
| **[trackY]**               | `true`          | Vertical scrollbar                                             |
| **[invertX]**              | `false`         | Invert horizontal scrollbar position                           |
| **[invertY]**              | `false`         | Invert vertical scrollbar position                             |
| **[shown]**                | `native`        | Invert Vertical scrollbar position `native`, `hover`, `always` |
| **[viewClass]**            | *null*          | Add custom class to the view.                                  |
| **[barClass]**             | *null*          | Add custom class to scrollbars.                                |
| **[thumbClass]**           | *null*          | Add custom class to scrollbars' thumbnails.                    |
| **[compact]**              | `false`         | Make scrollbars position appears over content.                 |
| **[disabled]**             | `false`         | Disable the custom scrollbars and use the native ones instead. |
| **[scrollToDuration]**     | `400`           | The smooth scroll duration when a scrollbar is clicked.        |
| **[autoUpdate]**           | `true`          | Auto-update scrollbars on content changes.                     |
| **[disableOnBreakpoints]** | `HandsetLandscape`, `HandsetPortrait` | Disable custom scrollbars on specific breakpoints. |

---

#### API v5

| Name                       | Default value   | Description                                                           |
| -------------------------- | --------------- | --------------------------------------------------------------------- |
| **[track]**                | `vertical`      | Directions to track `horizontal`, `vertical`, `all`                   |
| **[position]**             | `native`        | Invert scrollbar position `native`,`invertX`,`invertY`, `invertAll`   |
| **[shown]**                | `native`        | Invert Vertical scrollbar position `native`, `hover`, `always`        |
| **[appearance]**           | `standard`      | Scrollbar appearance `standard`, `compact`.                           |
| **[viewClass]**            | *null*          | Add custom class to the view.                                         |
| **[barClass]**             | *null*          | Add custom class to scrollbars.                                       |
| **[thumbClass]**           | *null*          | Add custom class to scrollbars' thumbnails.                           |
| **[disabled]**             | `false`         | Disable the custom scrollbars and use the native ones instead.        |
| **[scrollToDuration]**     | `400`           | The smooth scroll duration when a scrollbar is clicked.               |
| **[autoUpdate]**           | `true`          | Auto-update scrollbars on content changes.                            |
| **[disableOnBreakpoints]** | `[HandsetLandscape, HandsetPortrait]` | Disable custom scrollbars on specific breakpoints. |



## 2. CSS variables

- Before

```scss
.my-scrollbar {
  --scrollbar-color: transparent;
  --scrollbar-container-color: transparent;
  --scrollbar-thumb-color: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover-color: rgba(0, 0, 0, 0.3);
  --scrollbar-border-radius: 4px;
  --scrollbar-size: 6px;
  --scrollbar-padding: 8px;
  --scroll-view-margin: 0;
  --scroll-view-color: transparent;
}
```

- After

```scss
.my-scrollbar {
  --scrollbar-color: transparent;
  --scrollbar-container-color: transparent;
  --scrollbar-thumb-color: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover-color: var(--scrollbar-thumb-color); // no hover effect value by default
  --scrollbar-border-radius: 7px;
  --scrollbar-size: 5px;
  --scrollbar-padding: 8px;
  --scroll-view-margin: 0;
  --scrollbar-min-size: 10%;
}
```

## 3. Smooth scroll

- Before:
  - Smooth scroll functions were observables

- After:
  - Smooth scroll functions became promises


