# Changelog

## 1.5.4

- Regret: use renderer again, remove the state architecture.
- Fix wrong subscriptions, closes [#12](https://github.com/MurhafSousli/ngx-scrollbar/issues/12).
- Fix the tiny delay before rendering scrollbars thumbnails (which was introduced in v1.5.0).

## 1.5.0 (deprecated)

- Refactor: bind a state instead of using renderer
- Refactor: Make classes inputs reactive
- Improve performance: run code using NgZone
- Support Universal: remove unsupported interfaces in Universal like `MouseEvent`

## 1.4.2

- Refactor with RxJS 5.5 pipe style

## 1.4.0

- Feature(autoUpdate): Add `[autoUpdate]` option to automatically update on content changes
- Feature(Update function): Add `update()` function to manually update scrollbars
- Enhancement: Add `height: 100%` to the component style

## 1.3.0

- Feature(custom classes) `[viewClass]`, `[barClass]` and `[thumbClass]` inputs to add custom classes

## 1.2.0

- Feature(ScrollTo function): Add animated scroll to a specific position
- Fix(scrollbar positions when content is changed)

## 1.1.0

- Refactor(Scrollbar Component)
- Fix(dragging scrollbars) closes [#3](https://github.com/MurhafSousli/ngx-scrollbar/issues/3)

## 1.0.1

- Change `trackX` input to `false` by default

## 1.0.0

- Remove `characterData: true` from the MutationObserver which was causing a issue in nested scrollbars
- Use `ViewEncapsulation.None` for the component style

## 0.5.0

- Initial release
