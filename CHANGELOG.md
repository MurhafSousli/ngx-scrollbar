# Changelog

## 13.0.1

- feat: Add reached event unit tests.
- fix: Reached event is not fired, closes [#495](https://github.com/MurhafSousli/ngx-scrollbar/issues/495) in [5233793](https://github.com/MurhafSousli/ngx-scrollbar/pull/496/commits/52337930e538bb505072ee7759f005f47606f296).
- enhance: Reached directives should subscribe to the scroll event outside angular zone.
- refactor: Replace the usage of the deprecated `pluck` RXJS operator with `map`

## 13.0.0

- feat: Standalone component mode.

### Breaking changes

- `SmoothScrollModule` has been removed, you can import `SmoothScroll` directive directly instead!
- `NgScrollModule.withConfig()` function has been removed, use `NG_SCROLLBAR_OPTIONS` to set the global config instead!

## 12.0.1

- fix: when enable strictTemplates, incorrect types error on boolean value for input properties, closes [#491](https://github.com/MurhafSousli/ngx-scrollbar/issues/491) in [#492](https://github.com/MurhafSousli/ngx-scrollbar/pull/492)

## 12.0.0

- Update to Angular 16
- Remove `bezier-easing` package from dependencies

## 11.0.0

- Update to Angular 15 in [ca5e7cc](https://github.com/MurhafSousli/ngx-scrollbar/pull/471/commits/ca5e7ccbb826eb522e586c04639aeb8b13f01076).

## 10.0.1

- Virtual Scroll integration is broken after Angular CDK 14.1.0, closes [#448](https://github.com/MurhafSousli/ngx-scrollbar/issues/448) in [efdaff9](https://github.com/MurhafSousli/ngx-scrollbar/commit/efdaff913ab92acee7a5cce65dafbf3fe4ca0808).

## 10.0.0

- Update to Angular 14 in [668fb23](https://github.com/MurhafSousli/ngx-scrollbar/pull/443/commits/668fb23ae1c6ced33a3c8b202717018faaebfa5a).

## 9.0.2

- fix: Downgrade rxjs to v6, closes [#424](https://github.com/MurhafSousli/ngx-scrollbar/issues/424) in [5807067](https://github.com/MurhafSousli/ngx-scrollbar/pull/428/commits/5807067523b6506286f911743751ad14b8aad3b7)

## 9.0.1

- Fix rxjs `peerDependencies` warning on installation and update dependencies in [#419](https://github.com/MurhafSousli/ngx-scrollbar/pull/419)

## 9.0.0

- Upgrade to Angular 13, closes [#413](https://github.com/MurhafSousli/ngx-scrollbar/issues/413) in [b105a0a](https://github.com/MurhafSousli/ngx-scrollbar/pull/414/commits/b105a0ace5476e93f8520f04583eff2c27ddd39f).
- Use the proper types for events and objects instead of using `any`, in [f613d4f](https://github.com/MurhafSousli/ngx-scrollbar/pull/414/commits/f613d4f1306f84c1ce0ed6b7c8040b1f3f00e741) and [6829c0e](https://github.com/MurhafSousli/ngx-scrollbar/pull/414/commits/6829c0e2627dada07d5facdcc9bca885f4bb6001).

## 8.0.0

- feat: Build library in partial compilationMode, in [7c6e49d](https://github.com/MurhafSousli/ngx-scrollbar/commit/7c6e49dd572df1175d4d5a1642859f340c637af1).

### Breaking changes

- Possible breaking change in case of using it with Angular 9.

## 7.6.1

- feat: Ability to change scrollbar transition duration and delay using CSS variables, closes [#383](https://github.com/MurhafSousli/ngx-scrollbar/issues/383) in [221b700](https://github.com/MurhafSousli/ngx-scrollbar/pull/391/commits/221b70079a24e60cca214ecc0f0b32d6c66e0c49).
- feat: Add `overscroll-behavior` option as a CSS variable `--scrollbar-overscroll-behavior`, in [1aa81e4](https://github.com/MurhafSousli/ngx-scrollbar/pull/391/commits/1aa81e459d7f94a3bd9172bdb1c1f71fcc974136).
- fix: Update scrollbar when dir changes, in [cce5c14](https://github.com/MurhafSousli/ngx-scrollbar/pull/391/commits/cce5c14d474abe7205a620b06372a9a81003f942).

## 7.6.0 (Important Update)

- Fix performance issue regarding change detection loop in case `OnPush` is not used, closes [#373](https://github.com/MurhafSousli/ngx-scrollbar/issues/373) in [11128c9](https://github.com/MurhafSousli/ngx-scrollbar/commit/11128c958c2e9a0ea28c35a5c7b38d62140b0c13).

>  NOTE: In v7.6.0 Do not disable the sensors if you are integrating the scrollbar with the CDK virtual scroll component

## 7.5.6

- fix: peerDependencies for Angular 12, closes [#368](https://github.com/MurhafSousli/ngx-scrollbar/issues/368) in [132ab56](https://github.com/MurhafSousli/ngx-scrollbar/pull/372/commits/132ab566aa83ac3357111c03833cdd39e876d7db).

## 7.5.5

 > NOTE: This version has peerDependencies error on install

- Upgrade to Angular 12, closes [#368](https://github.com/MurhafSousli/ngx-scrollbar/issues/368) in [cff2eab](https://github.com/MurhafSousli/ngx-scrollbar/pull/370/commits/cff2eabb201f3c4e14be1fd1ce719dc44dea3523).


## 7.5.4

- fix thumb drag position after scrolling the outer container, closes [#342](https://github.com/MurhafSousli/ngx-scrollbar/issues/342) in [30158e9](https://github.com/MurhafSousli/ngx-scrollbar/pull/349/commits/30158e9c2f73c2fc5262e288c944e457ef79ac99).

## 7.5.3

- fix: Create `ResizeObserver` interface, closes [#336](https://github.com/MurhafSousli/ngx-scrollbar/issues/336) in [dd0718c](https://github.com/MurhafSousli/ngx-scrollbar/pull/339/commits/dd0718c9da908f1eb9d5a6b47e57713bac49e6da).
- Update peer-dependencies to Angular 11

## 7.5.2

- fix build: Add resize-observer-browser dependency, closes [#336](https://github.com/MurhafSousli/ngx-scrollbar/issues/336) in [60dd480](https://github.com/MurhafSousli/ngx-scrollbar/pull/338/commits/60dd480d17949aaf656fa550589a940664cd6229).

## 7.5.0

- feat: Add resize sensor unit tests

### Breaking changes

- Deprecate the resize observer polyfill (package: `@juggle/resize-observer`), closes [#329](https://github.com/MurhafSousli/ngx-scrollbar/issues/329) in [9069192](https://github.com/MurhafSousli/ngx-scrollbar/pull/331/commits/9069192074c64164d65b5aa3a7f7a25fa8af72f5).
- Auto-height: the feature became disabled by default, in [bf8cda1](https://github.com/MurhafSousli/ngx-scrollbar/pull/331/commits/bf8cda13fdc33247114561827c68f71f00182106).
  
 > The reason to disable the auto-height by default is to avoid performance issues with users who are unaware that it is turned on.
 > When the auto-height is on, and the content size changes very frequently, it could cause performance issue, like in virtual scroll and infinite scroll libraries.

## 7.4.2

- feat: Add the options missing interface of scrollToElement method in [5867163](https://github.com/MurhafSousli/ngx-scrollbar/pull/328/commits/586716361cc464b109f1d82311859e7f44ee31c5).
- fix: scrollToElement customOptions default value in [fff0c72](https://github.com/MurhafSousli/ngx-scrollbar/pull/326/commits/fff0c72bdddb1ff406526f2aa47dd79d4891aece).

## 7.4.1

- fix(Auto-width): Set component width instead of minWidth, closes [#319](https://github.com/MurhafSousli/ngx-scrollbar/issues/319) in [4d2176f](https://github.com/MurhafSousli/ngx-scrollbar/pull/320/commits/4d2176f8f8932554aba8832dd8a5e1b3d066bdfb).
- refactor(Auto-height, Auto-width) features
- make sure child container are equal to component height when set (auto-height/auto-width)
- fix tests

## 7.4.0

- Update dependencies to Angular 11.
- Refactor the library with strict mode.
- feat: Include scrollbar padding when hovering, closes [#300](https://github.com/MurhafSousli/ngx-scrollbar/issues/300) in [f907c72](https://github.com/MurhafSousli/ngx-scrollbar/pull/314/commits/f907c721eaf1e17350445a5fae4b68d4a764bbe3) and [f4c0a0d](https://github.com/MurhafSousli/ngx-scrollbar/pull/314/commits/f4c0a0dcd7557f9ae0943a59fc3bb300f13b3e63).
- feat: Ability to disable auto-height feature, closes [#311](https://github.com/MurhafSousli/ngx-scrollbar/issues/311) in [f76d347](https://github.com/MurhafSousli/ngx-scrollbar/pull/310/commits/f76d347717f64bb0dd478af8629570c19c592029).
- feat: Auto-width feature, in [c934b04](https://github.com/MurhafSousli/ngx-scrollbar/pull/310/commits/c934b04b8244ff3d7ef865eb43c1e23a3b9e32bd).

## 7.3.1

- fix: Safe-check viewport clientHeight in auto-height mode, closes [#307](https://github.com/MurhafSousli/ngx-scrollbar/issues/307) in [8136f9d](https://github.com/MurhafSousli/ngx-scrollbar/pull/308/commits/8136f9db91cf34f00078c737968d488305ba97b7).

## 7.3.0

- feat: Upgrade to Angular 10.
- fix(reached): Can't bind to 'reachedOffset' since it isn't a known property of 'ng-scrollbar', closes [#293](https://github.com/MurhafSousli/ngx-scrollbar/issues/293) in [cc9b1b5](https://github.com/MurhafSousli/ngx-scrollbar/commit/cc9b1b58d3493bdd71a84456005cc890a2750002).

## 7.2.3

- fix(core): fix crash when executing on SSR, closes [#267](https://github.com/MurhafSousli/ngx-scrollbar/issues/267) in [17d8bb1](https://github.com/MurhafSousli/ngx-scrollbar/pull/289/commits/17d8bb1a78190e6b836334f7eb2d94b0a8431172).

## 7.2.1-beta.0

- fix: adjust hiding the native scrollbar, closes [#266](https://github.com/MurhafSousli/ngx-scrollbar/issues/266) in [110a24e](https://github.com/MurhafSousli/ngx-scrollbar/pull/277/commits/110a24e7ce30a2dcfb46f16fb68f396a8d1155eb) and [110a24e](https://github.com/MurhafSousli/ngx-scrollbar/pull/277/commits/7274e9406205e180efae6b84fde6a1631e73d7f7).
- fix(ivy): Use directive instead of pipe in [5058a8a](https://github.com/MurhafSousli/ngx-scrollbar/pull/277/commits/5058a8ad6804d2849dcb60cf594d72d2f2ecdd2a).
- fix(Angular 9): Update dependencies (Angular and CDK), closes[#272](https://github.com/MurhafSousli/ngx-scrollbar/issues/272) in [ffbceab](https://github.com/MurhafSousli/ngx-scrollbar/pull/277/commits/ffbceabb523c6965dc58ad221695c9d5c167919e).

## 7.2.0

- Feat: Ability to set `NgScrollbarModule.withConfig(options)` in [6fca314](https://github.com/MurhafSousli/ngx-scrollbar/pull/265/commits/6fca3146b802683a29ffd8e382c1ecca1d06a9e6).
- Feat: Ability to propagate `mousemove` events of the viewport element, closes[#255](https://github.com/MurhafSousli/ngx-scrollbar/issues/255) in [d24804a](https://github.com/MurhafSousli/ngx-scrollbar/pull/265/commits/d24804a95ba54a8fdbf04c2a7fb734fb48122251).
- Feat: Ability to use string value on boolean inputs in [752d715](752d715).
- Fix: Fix ivy problem by using a directive instead of a pipe to set the CSS variable, closes [#217](https://github.com/MurhafSousli/ngx-scrollbar/issues/217) in [c43ca40](https://github.com/MurhafSousli/ngx-scrollbar/commit/c43ca404d0af9f78c12de9e8c485a289507f63f4).
- Fix: Adjust hiding the native scrollbars on MacOS and Android in [0b590d7](https://github.com/MurhafSousli/ngx-scrollbar/pull/265/commits/0b590d78054cd1b9363ae46826413370749ce95a).
- Fix: Fix compatibility with Angular material 9 in [a97f69f](https://github.com/MurhafSousli/ngx-scrollbar/commit/a97f69f0135f7612a69334667cc9d185327c22a9) and [3ce361f](https://github.com/MurhafSousli/ngx-scrollbar/commit/3ce361fdb058002c61664435860b175d216ea2a6).
- Fix: Remove installation warning in Angular 9 in [d8080a7](https://github.com/MurhafSousli/ngx-scrollbar/commit/d8080a73d08fa23ef3d1366944e4b741bfc3c8b0)

## 7.1.0

- Feat: Add `scrollAuditTime` option to tweak performance when on a low framerate budget, closes [#245](https://github.com/MurhafSousli/ngx-scrollbar/issues/245) in [0e0bccb](https://github.com/MurhafSousli/ngx-scrollbar/pull/250/commits/0e0bccb7fb8e6131ddd3265490f002e66775c44b).
- Fix: check options param for null values, closes [#247](https://github.com/MurhafSousli/ngx-scrollbar/issues/247) in [b3e67ed](https://github.com/MurhafSousli/ngx-scrollbar/commit/b3e67ed2c76af2b845569e45fe41df9b8d694522).
- Fix: Production build fails with 'strictNullChecks' compiler option, closes [#219](https://github.com/MurhafSousli/ngx-scrollbar/issues/219) in [ac1a0d6](https://github.com/MurhafSousli/ngx-scrollbar/commit/ac1a0d6b197416e7ff186b54121f6b9d3e436914).

## 7.0.2

- Fix: Remove `scroll-behavior` CSS rule, closes [#242](https://github.com/MurhafSousli/ngx-scrollbar/issues/242) in [6b89d6f](https://github.com/MurhafSousli/ngx-scrollbar/commit/6b89d6fe72933b83681fedce826385d7f6932fef).
- Fix: fix auto-height update, closes [#243](https://github.com/MurhafSousli/ngx-scrollbar/issues/243) in [7cac0fb](https://github.com/MurhafSousli/ngx-scrollbar/commit/7cac0fb6ff45943bb99f9cad37979d949e2cb5c7).

## 7.0.1

- Fix: Scrollbar breaks when loading on mobile, closes [#236](https://github.com/MurhafSousli/ngx-scrollbar/issues/236) in [33dfa71](https://github.com/MurhafSousli/ngx-scrollbar/commit/33dfa7169ab73ed404ff144ae1f187c75e5b9f7f).
- Update package dependencies in [9523194](https://github.com/MurhafSousli/ngx-scrollbar/pull/237/commits/95231944850f0db3873d50abc04bafb085db774b).

## 7.0.0

- Fix: auto-height feature in [aa16191](https://github.com/MurhafSousli/ngx-scrollbar/pull/234/commits/aa1619111be7b8769b1e909d0ef90a5ef43dfe61) and [0560af2](https://github.com/MurhafSousli/ngx-scrollbar/pull/235/commits/0560af2883a48b112b89a7a2369f29ef693783b0).
- Enhance: Prevent selection on track click, in [529450f](https://github.com/MurhafSousli/ngx-scrollbar/pull/235/commits/529450f756bae9cf080f45154034482ec813b8df) and [4f66fd2](https://github.com/MurhafSousli/ngx-scrollbar/pull/235/commits/4f66fd29d4220904dd4024202d2dc3b6c0eb0608).
- Enhance: Make sure viewport pointer-events are cleaned up on destroy, in [4b909f6](https://github.com/MurhafSousli/ngx-scrollbar/pull/235/commits/4b909f64346518eef26e9bd8b1d04d7244a5a190).

## 7.0.0-beta.0

- Feat: Add `[pointerEventsMethod]="viewport | scrollbar"` option, this sets the method used for detecting scrollbar pointer events, closes [#216](https://github.com/MurhafSousli/ngx-scrollbar/issues/216) in [c552e60](https://github.com/MurhafSousli/ngx-scrollbar/pull/228/commits/c552e6009b27bae7c5c01a5b6e9d82eee029f978).
- Feat: Add auto-height, closes [#214](https://github.com/MurhafSousli/ngx-scrollbar/issues/214) in [940d8df](https://github.com/MurhafSousli/ngx-scrollbar/pull/230/commits/940d8df7a8505a0050aa252ac1d6db548a6c16bc)..
- Refactor: Rename disabled attribute, closes [#218](https://github.com/MurhafSousli/ngx-scrollbar/issues/218) in [f0206fd](https://github.com/MurhafSousli/ngx-scrollbar/pull/226/commits/f0206fd5432f5988945cab3bf264c70d766d362d).
- Refactor: Use a directive for each scrollbar part.
- Feat: Add CSS variable to disable transition for scrollbar thumb size change.
- Refactor: Merge `[trackClicked]` and `[thumbClicked]` with into one option `[pointerEventsDisabled]`, closes [#229](https://github.com/MurhafSousli/ngx-scrollbar/issues/229) in [ef1176b](https://github.com/MurhafSousli/ngx-scrollbar/pull/228/commits/ef1176b829e39fda8554ffd12968465f1307aee1).
- Fix: Production build fails with 'strictNullChecks' compiler option, close [#219](https://github.com/MurhafSousli/ngx-scrollbar/issues/219) in [45fc235](https://github.com/MurhafSousli/ngx-scrollbar/pull/221/commits/45fc235eff271ba453fdb1dcae190d018fa34134).

### Breaking changes: 

- Add `[pointerEventsMethod]` input that can be either `"scrollbar"` or `"viewport"`, default `"scrollbar"`.
   * Use viewport pointer events to detect scrollbar clicks and drag event.
    **Pro:**
     - Scrolling works when mouse is over the scrollbar element
    **Cons:**
     - If used with `[appearance]="standard"` and both vertical and horizontal direction were scrollable, content may overlap under the scrollbar.
   * Use scrollbar pointer events to detect scrollbar clicks and drag event.
   **Pro:**
     - This works properly with `[appearance]="standard"` content never overlap with the scrollbar.
    **Cons:**
     - Scrolling doesn't work when mouse is over the scrollbar element

- Replace `[trackClickedDisabled]` and `[thumbDragDisabled]` with one option `[pointerEventsDisabled]`.


## 6.0.0

- Feat(SmoothScroll): Ability to pass `HTMLElement`, `ElementRef` or `string` for element selector in the smooth scroll functions.
- Feat(SmoothScroll): Ability to use scrollTo function using `top`, `left`, `right`, `bottom`, `start` and `end`.
- Feat(SmoothScroll): Ability to set an offset in `scrollToElement` function using `top` and `left` options' properties.
- Feat(SmoothScroll): Use bezier-easing makes it easier to customize the smooth scroll ease function [#208](https://github.com/MurhafSousli/ngx-scrollbar/issues/208) in [c3436a2](https://github.com/MurhafSousli/ngx-scrollbar/pull/212/commits/c3436a2bc45487f6a117a034dedf976388cc175b).
- Fix all smooth scroll problems, closes [#186](https://github.com/MurhafSousli/ngx-scrollbar/issues/186) in [b5072b2](https://github.com/MurhafSousli/ngx-scrollbar/pull/209/commits/b5072b2feca6154f0bbb60ff725b1fcf5351d3b6).
- Fix Scrollbar appears in some cases even if content isn't scrollable, closes [#198](https://github.com/MurhafSousli/ngx-scrollbar/issues/198) in [a4233b4](https://github.com/MurhafSousli/ngx-scrollbar/pull/207/commits/a4233b41f9f8e8aa7fd5d85cb3529f862c7f207e).
- Fix white page issue in Edge, closes [#205](https://github.com/MurhafSousli/ngx-scrollbar/issues/205) in [4547370](https://github.com/MurhafSousli/ngx-scrollbar/pull/206/commits/4547370fca867cb76fc4d3a8d8234a35647d378f).
- Add `@juggle/resize-observer` to dependencies, closes [#185](https://github.com/MurhafSousli/ngx-scrollbar/issues/185) in [c2b524c](https://github.com/MurhafSousli/ngx-scrollbar/pull/202/commits/c2b524cd25b36d7504fa9a76bace4bbbf8f10b8b).
- Avoid calling `getRtlScrollAxisType()` in scroll reached events, closes in [#203](https://github.com/MurhafSousli/ngx-scrollbar/issues/203) in [295ac17](https://github.com/MurhafSousli/ngx-scrollbar/pull/204/commits/295ac1788f8c520da914ae7d9e3cd3184b4e1643)

### Breaking changes

- Smooth scroll functions options parameters has been modified `scrollToBottom`, `scrollToTop`, `scrollToLeft`, `scrollToRight`, `scrollToSelector`
- Refactor smooth scroll functions parameters `scrollTo` and `scrollToElement`, see the wiki for new option interface.
- `ngScrollbar.scrollToSelector('#target')` has been removed, you can now use `ngScrollbar.scrollToElement('#target')` instead

## 5.0.2

- Fix reached events in RTL in Mozilla and Safari, closes [#193]() in [8279828](https://github.com/MurhafSousli/ngx-scrollbar/pull/194/commits/8279828d1523897c238bbcfa926f8d3ec45370d1).
- Fix reached events in AOT, closes #187, closes [#187](https://github.com/MurhafSousli/ngx-scrollbar/issues/187) in [5f67fe3](https://github.com/MurhafSousli/ngx-scrollbar/pull/192/commits/5f67fe3bbfae81a99e2943b872ccfc9a1578f21a).
- Refactor scroll viewport layout with absolute positioning, closes [#189](https://github.com/MurhafSousli/ngx-scrollbar/issues/189) in [c9c4dae](https://github.com/MurhafSousli/ngx-scrollbar/pull/190/commits/c9c4dae14d66a0e506dcccd0912252985e53bf62).

## 5.0.1

- fix: Hovering on a scrollbar highlights both scrollbars, closes [#181](https://github.com/MurhafSousli/ngx-scrollbar/issues/181) in [b533413](https://github.com/MurhafSousli/ngx-scrollbar/pull/182/commits/b53341346abf33be59eb760b7c64c08816a2059d).
- fix: Add missing polyfill `@juggle/resize-observer` to peerDependencies.

## 5.0.0

- Feat: Add `sensorDebounce` and `sensorDisabled` to `NgScrollbarOptions`.
- Feat: Use native **ResizeObserver**  API if available, otherwise lazy-load the polyfill, in [7efd0a2](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/7efd0a20fbc7af9311c97503da1632380516b348).
- Feat: Ability for element parameters types to be `ElementRef` in smooth scroll functions, in [1a4d578](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/1a4d5784ae56cbc94ec38b64d17c0f3a7e94a4a1).
- Enhance: Validate boolean and number inputs, in [298e91b](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/298e91b6542d550a6bd2fb636dd12197d9384626).
- Refactor: Rename `disableThumbDrag` to `thumbDragDisabled` in component inputs and `NgScrollbarOptions`, in [df31a97](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/df31a9781447a16d7679331aec2f93fc626b14d8).
- Refactor: Rename `disableTrackClick` to `trackClickDisabled` in component inputs and `NgScrollbarOptions`, in [df31a97](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/df31a9781447a16d7679331aec2f93fc626b14d8).
- Refactor: Rename `scrollToDuration` to `trackClickScrollDuration` in component inputs and `NgScrollbarOptions`, in [df31a97](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/df31a9781447a16d7679331aec2f93fc626b14d8).
- Refactor: Use standard positioning instead of the absolute  in [4cbe7ee](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/4cbe7ee7d388c07f4434a4a94a9af977eb31a281).
- Refactor: Use the CDK's getRtlScrollAxisType instead of browser check, in [275cce3](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/275cce3aab5b7fe86b9e15830bc7623588faee6a).
- Refactor: Remove `NgScrollbarModule.withConfig()` option.
- Bug: fix hover transition when `visibility="hover"`, in [f67a69](https://github.com/MurhafSousli/ngx-scrollbar/pull/158/commits/f67a69c0e72b71b4818ebed0b9d21f2a9f23549a). 

### Breaking Changes

To remove complexity, the `ResizeObserver` API by default if it is available in the browser otherwise import the polyfill async

- Remove `ContentSensor` and `ResizeSensor` directives.
- Remove `NgScrollbarContentSensorModule` and `NgScrollbarResizeSensorModule` modules.
- Remove `disableThumbDrag` in favor of `thumbDragDisabled` in component inputs and `NgScrollbarOptions`.
- Remove `disableTrackClick` in favor of `trackClickDisabled` in component inputs and `NgScrollbarOptions`.
- Remove `scrollToDuration` in favor of `trackClickScrollDuration` in component inputs and `NgScrollbarOptions`.
- Remove `NgScrollbarModule.withConfig()` option, provide the `NG_SCROLLBAR_OPTIONS` token for global options instead.

## 5.0.0-beta.1

- Enhance: Enable scrolling when pointer is over the scrollbar in the standard appearance is used.
- Bug: Scrollbar hover behavior is inconsistent (especially when a hover size is used).
- Bug: CDK content wrapper is not getting `ng-scroll-content-wrapper` class.
- Bug: CSS variable `--scrollbar-hover-color` isn't effective after disabling the pointer events.
- Remove the CSS variables `--scrollbar-wrapper-color` and `--scrollbar-viewport-margin`.

## 5.0.0-beta.0

- Upgrade to Angular 8, closes [#161](https://github.com/MurhafSousli/ngx-scrollbar/issues/161).
- Feat: Mobile browser support, closes [#172](https://github.com/MurhafSousli/ngx-scrollbar/issues/172).
- Feat: Scroll works when mouse is over the scrollbars, closes [#168](https://github.com/MurhafSousli/ngx-scrollbar/issues/168).
- Feat: Resize Sensor directive, closes [#166](https://github.com/MurhafSousli/ngx-scrollbar/issues/166).
- Feat: Use with 3rd party libraries such as `ngx-infinite-scroll`, closes [#155](https://github.com/MurhafSousli/ngx-scrollbar/issues/155).
- Feat: Add global options provider, closes [#154](https://github.com/MurhafSousli/ngx-scrollbar/issues/154).
- Feat: Add an option to set the minimum size for the scrollbar thumbnail, closes [#171](https://github.com/MurhafSousli/ngx-scrollbar/issues/171).
- Feat: Add reached outputs, closes [#159](https://github.com/MurhafSousli/ngx-scrollbar/issues/159).
- Bug: Fix RTL for horizontal scrollbar, closes [#169](https://github.com/MurhafSousli/ngx-scrollbar/issues/169).
- Bug: Nested scrollbars, child component scroll event not working, closes [#146](https://github.com/MurhafSousli/ngx-scrollbar/issues/146).
- Enhance: Refactor component layout with CSS Grid, closes [#157](https://github.com/MurhafSousli/ngx-scrollbar/issues/157).
- Enhance: Use promises for smooth scroll functions, closes [#152](https://github.com/MurhafSousli/ngx-scrollbar/issues/152).
- Enhance: Use empty space in the scrollbars corner when both vertical and horizontal is shown, closes [#151](https://github.com/MurhafSousli/ngx-scrollbar/issues/151)
- Enhance: Provide smooth scroll functionality as a service, closes [#162](https://github.com/MurhafSousli/ngx-scrollbar/issues/162).
- Enhance: Add unit testing, closes [#163](https://github.com/MurhafSousli/ngx-scrollbar/issues/163).
- Enhance: Scrollbar is getting too much space depending on OS and Browser, closes [#147](https://github.com/MurhafSousli/ngx-scrollbar/issues/147).

**Known issue**

- BUG: When used with CDK Virtual scroll, scrolling goes up and down.


## 4.2.0

- feat: Add support for virtual scrolling, closes [#140](https://github.com/MurhafSousli/ngx-scrollbar/pull/140) in [aaf5dc5](https://github.com/MurhafSousli/ngx-scrollbar/pull/140/commits/aaf5dc5a2d80ed9bc075f581ff3eb66062f00f73).
- enhance: Update scrollbars on window resize [#123](https://github.com/MurhafSousli/ngx-scrollbar/pull/123) in [252e769](https://github.com/MurhafSousli/ngx-scrollbar/pull/142/commits/252e7692b02fc3bfdbc759a5a5296ad696acf9ad).

## 4.1.1

- fix: Horizontal scrollbar in non-compact mode on Firefox and Edge, in [35ae8d4](https://github.com/MurhafSousli/ngx-scrollbar/pull/117/commits/35ae8d45130e3c19506249328fff3c2fbd48bce2)
- fix: Remove webkit-scrollbar transparent background, closes [#106](https://github.com/MurhafSousli/ngx-scrollbar/issues/106) in [7fe3749](https://github.com/MurhafSousli/ngx-scrollbar/pull/117/commits/7fe3749757e44e13ce6c9bbb1c6989f844bf2a35).
- fix: in some cases, native scrollbar are shown after it is enabled, in [59124ff](https://github.com/MurhafSousli/ngx-scrollbar/commit/59124ff4facc714bfbe63330591d558ff67c263e).
- fix: Nested `<ng-scrollbar>`s inherit overflow style, in [9c83b22](https://github.com/MurhafSousli/ngx-scrollbar/pull/116/commits/9c83b2220cbdfd03eab1efeaa22fe0d17cccebf9).
- fix: Compact mode on Edge, in [2be44c6](https://github.com/MurhafSousli/ngx-scrollbar/pull/116/commits/2be44c617a87af8b5b09202a55a5b58f5b7d32fc).

## 4.1.0

- feat: Fix horizontal scrollbar position, closes [#113](https://github.com/MurhafSousli/ngx-scrollbar/issues/113) in [c435932](https://github.com/MurhafSousli/ngx-scrollbar/commit/c43593248197eac41c71a64ec58d3870887764ba).
- feat: Ability to always show scrollbars even if content is not scrollable, closes [#112](https://github.com/MurhafSousli/ngx-scrollbar/issues/112) in [2df15de](https://github.com/MurhafSousli/ngx-scrollbar/commit/2df15de703a08eb703fcfed4f6775820bd02c2c4).
- refactor: Add `[shown]` input and remove `[autoHide]`, Ability to always show scrollbars.

### Breaking changes

- The `[autoHide]` input has been removed in favor of `[shown]`.

**Before:** `[autoHide]="true"` shows scrollbar only when mouse is over the scroll view.

**After:** Use `shown="hover"` or `[shown]="'hover'"`.

## 4.0.0

- feat(RTL Support): Fix horizontal scrollbar on RTL, in [9d992e6](https://github.com/MurhafSousli/ngx-scrollbar/pull/111/commits/9d992e6bf92343eb266b266aecfd36fd80d62ce9).
- feat: Add `invertX` and `invertY` inputs to invert scrollbars position, in [3571b63](https://github.com/MurhafSousli/ngx-scrollbar/pull/111/commits/3571b63a0c0ccd5d8efb054f84a0bc272075d422).
- feat: Add CSS variables to ease styling the component, in [33ed138](https://github.com/MurhafSousli/ngx-scrollbar/pull/111/commits/33ed138b87614d5e953cc2a5b3bfad888e720e49).
- enhance: Improve layout using flex-box.
- refactor: Rename `[overlay]` to `[compact]`
- fix: Using the default change detection strategy with `[disabledOnBreakpoints]="false"` produces `ExpressionChangedAfterItHasBeenCheckedError`, closes [#108](https://github.com/MurhafSousli/ngx-scrollbar/issues/108) in []().

### Breaking changes

- The input `[overlay]` has been renamed to `[compact]`

## 3.3.4

- Fix breakpoints unable to enable the scrollbar after it was disabled, closes [#109](https://github.com/MurhafSousli/ngx-scrollbar/issues/109) in [3485d68](https://github.com/MurhafSousli/ngx-scrollbar/commit/3485d68db9a2a822d0a87b4a7a06438700e485b1).

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
