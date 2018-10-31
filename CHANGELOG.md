# Changelog

## 3.0.0

- feat(SmoothScroll): Add `[smoothScroll]` directive which can be imported independently e.g. `import {SmoothScrollModule} from 'ngx-scrollbar'`.
- feat(NgScrollbar): Add `[disableOnBreakpoints]` to disable the custom scrollbars on certain breakpoints.
- refactor(NgScrollbar): Improve performance by removing `(scrollState)` output which causes a change detection on each emit.
- fix(NgScrollbar): Fallback to native scrollbars on mobile, closes [#59](https://github.com/MurhafSousli/ngx-scrollbar/issues/59).
- enhance(NgScrollbar): Improve component default styles.

### Breaking Changes

- The component class name has changed from `ScrollbarComponent` to `NgScrollbar`.
- The module class name has changed from `ScrollbarModule` to `NgScrollbarModule`.
- `(scrollState)` output is removed, to get the scroll event use the component ref, example:

```ts
@ViewChild(NgScrollbar) ngScrollbar: NgScrollbar;
ngScrollbar.scrollable.elementScrolled().subscribe(e => console.log(e))
```

## 2.3.0

- feat(ScrollbarComponent): All scrollTo functions return an observable that emits when the scroll function is done.
- feat(ScrollbarComponent): Add `scrollTo` and `scrollToElement` functions, in [6acdf70](https://github.com/MurhafSousli/ngx-scrollbar/pull/66/commits/6acdf705aaaefa65beeb468425c09c30c85b670b).
- feat(ScrollbarComponent): Add cross-browser smooth scroll, in [6acdf70](https://github.com/MurhafSousli/ngx-scrollbar/pull/66/commits/6acdf705aaaefa65beeb468425c09c30c85b670b).
- fix peerDependencies for Angular >= 6, in [6c78229](https://github.com/MurhafSousli/ngx-scrollbar/pull/66/commits/6c782295a643fbdd5d4fada06caa0a39e4388bfe).
- fix(ScrollbarComponent): Scrollbar are not shown on init, closes [#48](https://github.com/MurhafSousli/ngx-scrollbar/issues/48) in [bac70d5](https://github.com/MurhafSousli/ngx-scrollbar/pull/66/commits/bac70d585405d814bd7d4d713b733b4612f44dc7).
- refactor(ScrollbarComponent): Use right and bottom to hide the native scrollbars, in [91b6b6f](https://github.com/MurhafSousli/ngx-scrollbar/pull/66/commits/91b6b6f29f9a0dac4c2a37b6d3cc3a06edeab1e8).
- refactor(ScrollbarComponent): Encapsulate component styles, in [0fd9b92](https://github.com/MurhafSousli/ngx-scrollbar/pull/66/commits/0fd9b92fc86486e60ff326696e0a5d567bcbff7c).
- enhance(ScrollbarComponent): Use CDK ScrollModule instead of native scroll event, in [d5d59b3](https://github.com/MurhafSousli/ngx-scrollbar/pull/66/commits/d5d59b36f999fa3811ee37a0eabb20eea9949734).

### Breaking changes:

- Must subscribe on any *scrollTo* function you use, e.g. `ScrollbarComponent.scrollToBottom().subscribe()`

## 2.2.0

- fix(ScrollbarComponent): fix SSR by checking if the `MutationObserver` code is running on the browser, in [86adf42](https://github.com/MurhafSousli/ngx-scrollbar/pull/55/commits/86adf42ff9bd1f1594df8ae38ddfe1d32152bf75).
- refactor(ScrollbarComponent): General refactor, in [3d406a3](https://github.com/MurhafSousli/ngx-scrollbar/pull/56/commits/3d406a30b9163e931fddeb448fe40f3c23b9f055).
- Update dependencies

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
