# Changelog

## 2.1.0

- feat(ScrollbarComponent): Adds `scrollToTop`, `scrollToBottom`, `scrollToRight`, `scrollToLeft` functions, closes [#39](https://github.com/MurhafSousli/ngx-scrollbar/issues/39) in [664982d](https://github.com/MurhafSousli/ngx-scrollbar/commit/664982dd9011586bad53ebcbd58c6f9dd0ecd419).

## 2.0.4

- enhancement(ScrollbarComponent): Ability to scrollTo without animation, closes [#29](https://github.com/MurhafSousli/ngx-scrollbar/issues/29) in [#37](https://github.com/MurhafSousli/ngx-scrollbar/pull/37)

## 2.0.3

- refactor(ScrollbarComponent): rxjs style for scrollbar thumb workers events in [#36](https://github.com/MurhafSousli/ngx-scrollbar/pull/36)

## 2.0.2

- fix(ScrollbarComponent): Strange scrollbar thumb behavior in Firefox, closes [#33](https://github.com/MurhafSousli/ngx-scrollbar/issues/33) in [#34](https://github.com/MurhafSousli/ngx-scrollbar/pull/34)

## 2.0.1

- fix(Build): fix AOT build error, closes [#30](https://github.com/MurhafSousli/ngx-scrollbar/issues/30) in [f0a5c85](https://github.com/MurhafSousli/ngx-scrollbar/commit/f0a5c858ea5802a7d00dcc269356bea93190357b)

## 2.0.0

- Upgrade to Angular 6, closes [#26](https://github.com/MurhafSousli/ngx-scrollbar/issues/26) in [#27](https://github.com/MurhafSousli/ngx-scrollbar/pull/27).

## 1.5.7

- Remove pointer from scrollbar to default

## 1.5.6

- Fixes a bug: Check if the subscription is defined before unsubscribing, closes [#18](https://github.com/MurhafSousli/ngx-scrollbar/issues/18).

## 1.5.5

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
