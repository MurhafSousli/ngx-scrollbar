# Changelog

## 3.3.3

- fix smooth scroll error which was introduced in 3.3.1 ([40540bb](https://github.com/MurhafSousli/ngx-scrollbar/pull/104/commits/40540bbe41ddc22868c716ae0118f0f2c628f763)).

## 3.3.2

- enhance: Show native scrollbars when disabled, closes [#99](https://github.com/MurhafSousli/ngx-scrollbar/issues/99) in [1bb5a08](https://github.com/MurhafSousli/ngx-scrollbar/pull/103/commits/1bb5a087aeb4e3deeebd6024b09e8b562f76dde6).
- enhance: Remove `overflow: scroll` when disabled, in [39badee](https://github.com/MurhafSousli/ngx-scrollbar/pull/103/commits/39badeef79b239d6f486ee8efb8cf82d747f893a) and [d5dcbdb](https://github.com/MurhafSousli/ngx-scrollbar/pull/103/commits/d5dcbdb31bddd8ddd40dc7088b78d2b0b46071ef).

## 3.3.1

- fix(NgScrollbar): fix server-side rendering crash, in [9c14b18](https://github.com/MurhafSousli/ngx-scrollbar/pull/100/commits/9c14b18a758b366bc3009ea951f399a09726aa2c) and [b02f4be](https://github.com/MurhafSousli/ngx-scrollbar/pull/100/commits/b02f4be7a8700791c8123c132c3cd7a8a9716992).

## 3.3.0

- fix(NgScrollbar): Avoid enable execution if disabled, in [d51d07e](https://github.com/MurhafSousli/ngx-scrollbar/pull/98/commits/d51d07e66b4c0de9f53351d76709f785f83fe3fa).
- fix(NgScrollbar): fix server-side rendering crash, in [edde8ff](https://github.com/MurhafSousli/ngx-scrollbar/pull/98/commits/edde8ff3af930a8d89a932d2815db9fbfb10ece2).
- enhance(NgScrollbar): Avoid overriding scrollbar component `box-sizing` value, closes [#96](https://github.com/MurhafSousli/ngx-scrollbar/issues/96) in [d51d07e](https://github.com/MurhafSousli/ngx-scrollbar/pull/98/commits/d51d07e66b4c0de9f53351d76709f785f83fe3fa).
- refactor(NgScrollbarThumb): Use vertical and horizontal component for clearer code, in ([49ac18b](https://github.com/MurhafSousli/ngx-scrollbar/pull/98/commits/49ac18b21d173c08ac3d3b027aa5b468aba33cd2) and [83fc884](https://github.com/MurhafSousli/ngx-scrollbar/pull/98/commits/83fc88474084954a885c02413abefc0b11f9dced).
- ci: test Node.js 8, 10 and 11 ([189b849](https://github.com/MurhafSousli/ngx-scrollbar/pull/98/commits/189b849ac3734a381151796732ac3a6bb358807e)).

## 3.2.2

- fix(SmoothScroll): Fix smooth scroll `duration` and `scrollToBottom()`, closes [#90](https://github.com/MurhafSousli/ngx-scrollbar/issues/90) in [c4e03d4](https://github.com/MurhafSousli/ngx-scrollbar/pull/91/commits/c4e03d479bc1d347635559789daeb55ea1de04cf).

## 3.2.1

- enhance(NgScrollbar): Keep native scrollbars hidden when the component is disabled,closes [#88](https://github.com/MurhafSousli/ngx-scrollbar/issues/88) in [4762a7e](https://github.com/MurhafSousli/ngx-scrollbar/pull/89/commits/4762a7ea9e4ce1203659e14cabee87f36e21a5b8) and [3ef3d8a](https://github.com/MurhafSousli/ngx-scrollbar/pull/89/commits/3ef3d8a965947b368973b97c1cd2a81ee351d74d).
- enhance(NgScrollbar): Push the native scrollbars 1px more to fix its appearance in Edge browser.
- refactor(NgScrollbarThumb): Refactor scrollbar initializer function, in [5dbcc22](https://github.com/MurhafSousli/ngx-scrollbar/pull/89/commits/5dbcc22280077e4ea0674fc554a7bf034bfea859).

## 3.2.0

- feat(NgScrollbar): Add `[overlay]` input to make scrollbars position appears over content.
- feat(NgScrollbar): Add `[disabled]` input to enable/disable the custom scrollbars, in [9ac7f8d](https://github.com/MurhafSousli/ngx-scrollbar/pull/87/commits/9ac7f8d12a1e8fb4c6e4dde7a5f5527fafbf20b4).
- feat(NgScrollbar): Add `characterData: true` to MutationObserver to update on text changes, remove the need to manually update the scrollbars.
- fix(NgScrollbar): Content goes out of the container when scroll bar is not present, closes [#86](https://github.com/MurhafSousli/ngx-scrollbar/issues/86) in [c8d9505](https://github.com/MurhafSousli/ngx-scrollbar/commit/c8d95051253ac36c1940c359fa52c94f8a953698).
- enhance(NgScrollbar): Don't update scrollbar if disabled, in [7f154e9](https://github.com/MurhafSousli/ngx-scrollbar/pull/87/commits/7f154e9fd81cb0207bf7363488cddbba22eadce3).
- enhance(NgScrollbarThumb): Make sure the last emit from MutationObserver is not ignored by `throttleTime`, in [fff2083](https://github.com/MurhafSousli/ngx-scrollbar/pull/87/commits/fff208328ce65f865fdd18ad3abb9e3e62362158).
- refactor(NgScrollbar, NgScrollbarThumb): Set scrollbar display value from parent component.
- refactor(NgScrollbarThumb): Use rxjs syntax to initialize scrollbar thumbnail size, in [f201736](https://github.com/MurhafSousli/ngx-scrollbar/pull/87/commits/f2017360d6a9f005145356a1c98fd67bf69846af).

## 3.1.3

- enhance(NgScrollbar): Use `animationFrameScheduler` to set scrollbar thumb position, in [717d221](https://github.com/MurhafSousli/ngx-scrollbar/commit/717d221dc66905a07861605082eb61040bbe544f).
- enhance(NgScrollbar): Add a smooth transition on scrollbar thumbnail size, in [8da5c31](https://github.com/MurhafSousli/ngx-scrollbar/pull/82/commits/8da5c31224c464fcdca6164a8fc739ddb489c92a).
- fix(NgScrollbar): Enable back the scrollbar after it was disabled, closes [#81](https://github.com/MurhafSousli/ngx-scrollbar/issues/81) in [9ce2f56](https://github.com/MurhafSousli/ngx-scrollbar/pull/83/commits/9ce2f5666ba99b0eb76b9cf5b41a28b764c4f8d1).

## 3.1.2

- refactor(NgScrollbar): Remove `padding` from view port styles and use container `bottom` and `right` to hide the native scrollbars, in [0f98686](https://github.com/MurhafSousli/ngx-scrollbar/pull/79/commits/0f986862974d7ba6e5c44175920f5aa2e79b6f77).
- regret(NgScrollbar): return `height: 100%` on component styles.

## 3.1.1

- fix(NgScrollbar): Fix `autoHide` option styles, closes [#76](https://github.com/MurhafSousli/ngx-scrollbar/issues/76) in [a94dd6a](https://github.com/MurhafSousli/ngx-scrollbar/pull/77/commits/a94dd6a03632f9548054a8d585388ec18efc5a6e).

## 3.1.0

- feat(NgScrollbar, SmoothScroll): Add offset value in `scrollToElement()` in [937374c](https://github.com/MurhafSousli/ngx-scrollbar/pull/73/commits/937374c4c7b48052376690a1d947d6bf2b7f2a89).
- fix(NgScrollbar): Fix scrollbar view on dynamic height, closes [#72](https://github.com/MurhafSousli/ngx-scrollbar/issues/72) in [3ea592f](https://github.com/MurhafSousli/ngx-scrollbar/pull/73/commits/3ea592f1524c9f125790169901d855fc75bd1181).
- fix(NgScrollbar): Fix scrollbar dragging in prod, in [f109322](https://github.com/MurhafSousli/ngx-scrollbar/pull/74/commits/f1093220aa4d74c188b4b220511fb4a9b0900883).
- enhance(NgScrollbar): Hide the scrollbar when its thumbnail size is 0, in [55f37e6](https://github.com/MurhafSousli/ngx-scrollbar/pull/73/commits/55f37e65e72e40f9fef5e093df59a04ec5a530f6).
- enhance(NgScrollbarThumb): Move scrollbar thumb styles to `NgScrollbar` component styles, removes the need to add `!important` to override the styles, in [8b59b64](https://github.com/MurhafSousli/ngx-scrollbar/pull/73/commits/8b59b649d24d53bb4e5ece0222ff66929f8d9227).
- enhance(NgScrollbarThumb): Use `OnPush` change detection, in [b05ee45](https://github.com/MurhafSousli/ngx-scrollbar/pull/73/commits/b05ee450af87070eecfde3c958c4bfc81cea9cdb).


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
