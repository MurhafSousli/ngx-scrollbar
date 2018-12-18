<p align="center">
  <img height="200px" width="200px" style="text-align: center;" src="https://cdn.rawgit.com/MurhafSousli/ngx-scrollbar/ee4c0ba4/src/assets/logo.svg">
  <h1 align="center">Angular Custom Scrollbar</h1>
</p>

[![npm](https://img.shields.io/badge/demo-online-ed1c46.svg)](https://murhafsousli.github.io/ngx-scrollbar/)
[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/ngx-scrollbar)
[![npm](https://img.shields.io/npm/v/ngx-scrollbar.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/ngx-scrollbar)
[![Build Status](https://travis-ci.org/MurhafSousli/ngx-scrollbar.svg?branch=master)](https://www.npmjs.com/package/ngx-scrollbar)
[![npm](https://img.shields.io/npm/dt/ngx-scrollbar.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/ngx-scrollbar)
[![npm](https://img.shields.io/npm/dm/ngx-scrollbar.svg)](https://www.npmjs.com/package/ngx-scrollbar)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](/LICENSE)

Custom overlay-scrollbars with native scrolling mechanism for Angular, it also provides a cross-browser smooth scroll directive.

___

## Table of Contents

- [Live Demo](https://MurhafSousli.github.io/ngx-scrollbar/)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Scroll Functions](#scroll-functions)
- [Styling](#styling)
- [Update scrollbars manually](#manual-update)
- [Smooth Scroll](#smooth-scroll)
- [Development](#development)
- [Issues](#issues)
- [Author](#author)
- [Credit](#credit)
- [More plugins](#more-plugins)

<a name="installation"/>

## Installation

**NPM**

```bash
npm i -S ngx-scrollbar @angular/cdk
```

**YARN**

```bash
yarn add ngx-scrollbar @angular/cdk
```

<a name="usage"/>

## Usage

Import `NgScrollbarModule` in your module

```js
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    // ...
    NgScrollbarModule
  ]
})
```

In your template

```html
<ng-scrollbar>
  <!-- Content -->
</ng-scrollbar>
```

Here is a [stackblitz](https://stackblitz.com/edit/ngx-scrollbar)

<a name="options">

## Options

### Scrollbar inputs

- **[trackX]**: boolean

  Horizontal scrollbar, default `false`

- **[trackY]**: boolean

  Vertical scrollbar, default `true`
  
- **[invertX]**: boolean

  Invert horizontal scrollbar position, default `false`

- **[invertY]**: boolean

  Invert vertical scrollbar position, default `false`

- **[shown]**: 'native' | 'hover' | 'always', default `native`

  Configure when scrollbars should be shown.
  
  - `native`: scrollbars are shown when content is scrollable.
  - `hover`: scrollbars are shown when mouse is over the view port (and content is scrollable).
  - `always`: scrollbars are always shown.

- **[autoUpdate]**: boolean

  Auto-update scrollbars on content changes, default: `true`

- **[viewClass]**: string

  Add custom class to the view, default: `null`

- **[barClass]**: string

  Add custom class to scrollbars, default: `null`

- **[thumbClass]**: string

  Add custom class to scrollbars' thumbnails, default: `null`
  
- **[compact]**: boolean

  Make scrollbars position appears over content, default: `false`
  
- **[disabled]**: boolean

  Disable the custom scrollbars and use the native ones instead, default: `false`
  
- **[scrollToDuration]**: number

  The smooth scroll duration when a scrollbar is clicked, default `400`.
  
- **[disableOnBreakpoints]**: Array of the CDK Breakpoints

  Disable custom scrollbars on specific breakpoints, default: `[Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait]`

***

 > Because it is not possible to hide the native scrollbars on mobile browsers, the only solution is to fallback to the native scrollbars.
 > *To disable this option give it false value.*

***

<a name="scroll-function"> 

### Scrollbar functions

To use *NgScrollbar* functions, you will need to get the component reference from the template. this can be done using the `@ViewChild` decorator, for example:

```ts
@ViewChild(NgScrollbar) scrollRef: NgScrollbar;
```

**Example:** Subscribe to `NgScrollbar` scroll event

```ts
@ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

ngAfterViewInit() {
  this.scrollbarRef.scrollable.elementScrolled().subscribe(e => console.log(e))
}
```

## Scroll functions

All scroll functions return a cold observable that requires calling `subscribe()`, it will emits once scrolling is done and unsubscribe itself, *no need to unsubscribe from the function manually.*

#### Scroll to position

```ts
scrollRef.scrollTo(options: ScrollToOptions).subscribe()
```

- **Left:** x position.
- **Top:** y position.
- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

#### Scroll to element

```ts
scrollRef.scrollToElement(selector, offset?, duration?, easeFunc?).subscribe()
```

- **Selector:** target element selector.
- **Offset:** Set scroll offset, default 0.
- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

#### Scroll horizontally

```ts
scrollRef.scrollXTo(position, duration?, easeFunc?).subscribe()
```

#### Scroll vertically

```ts
scrollRef.scrollYTo(position, duration?, easeFunc?).subscribe()
```

- **Position:** scrolling position on Y axis in pixels.
- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

#### Scroll to top

```ts
scrollRef.scrollToTop(duration?, easeFunc?).subscribe()
```

#### Scroll to bottom

```ts
scrollRef.scrollToBottom(duration?, easeFunc?).subscribe()
```

#### Scroll to left

```ts
scrollRef.scrollToLeft(duration?, easeFunc?).subscribe()
```

#### Scroll to right

```ts
scrollRef.scrollToRight(duration?, easeFunc?).subscribe()
```

- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

## Scrolling examples

### Scroll to top directly from the template

```html
<ng-scrollbar #scrollbarRef>
  <!-- Content -->
</ng-scrollbar>

<button (click)="scrollbarRef.scrollToTop()">Go to top</button>
```

### Scroll to a specific element

```html
<ng-scrollbar #scrollbarRef>
  <div id="..."></div>
  <div id="..."></div>
  <div id="..."></div>
  <div id="usage"></div>
  <div id="..."></div>
</ng-scrollbar>

<button (click)="scrollbarRef.scrollToElement('#usage')">Usage Section</button>
```

Or using the `@ViewChild` decorator

```ts
@ViewChild(NgScrollbar) scrollRef: NgScrollbar;

scrollToUsageSection() {
  this.scrollRef.scrollToElement('#usage');
}
```

### Scroll to top on route change

If you wrap the `<router-outlet>` with `<ng-scrollbar>`, you can scroll to top on route changes, like the following example:

```ts
export class AppComponent {

  @ViewChild(NgScrollbar) scrollRef: NgScrollbar;

  constructor(router: Router) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)),
      filter(() => !!this.scrollRef)),
      tap((event: NavigationEnd) => this.scrollRef.scrollToTop())
    ).subscribe();
  }
}
```

<a name="manual-update">

#### Update scrollbars manually

**Text area example:**

```ts
Component({
  selector: 'text-area-example',
  template: `
    <ng-scrollbar>
      <textarea [(ngModel)]="text"></textarea>
    </ng-scrollbar>
  `
})
export class AppComponent implements OnInit {
   @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;

   setText(value: string) {
     this.text = value;
     // You might need to give a tiny delay before updating the scrollbar
     setTimeout(() => {
       this.textAreaScrollbar.update();
     }, 200);
   }
}
```

You can also automatically resize the `<text-area>` with the [CDK Text-field](https://material.angular.io/cdk/text-field/overview).

```html
<ng-scrollbar>
  <textarea cdkTextareaAutosize #autosize="cdkTextareaAutosize" [(ngModel)]="code"></textarea>
</ng-scrollbar>
```

```ts
@ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;
@ViewChild(CdkTextareaAutosize) textareaAutosize: CdkTextareaAutosize;
  
setCode(code: string) {
  this.code = code;
  this.textareaAutosize.resizeToFitContent();
  setTimeout(() => {
    this.textAreaScrollbar.update();
  }, 200);
}
```

<a name="styling"/>

## Styling

Since `v3.4.0`, you can customize the scrollbar styles from the following CSS variables

```html
<ng-scrollbar class="my-scrollbar">
  <!-- content -->
</ng-scrollbar>
```
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

You can also use custom classes to override the styles

```html
<ng-scrollbar barClass="scrollbar" thumbClass="scrollbar-thumbs">
  <!-- content -->
</ng-scrollbar>
```
```scss
::ng-deep {
  ng-scrollbar.scrollbar {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
  ng-scrollbar.scrollbar-thumbs {
    background-color: rgba(161, 27, 27, 0.4);
    &:hover,
    &:active {
      background-color: rgba(161, 27, 27, 0.7);
    }
  }
}
```

<a name="smooth-scroll"/>

## Smooth Scroll

The `[smoothScroll]` directive allows you to scroll the host element smoothly using the scroll functions that works on cross-browser.

Since v3.0.0, The `SmoothScrollModule` has been added as an independent module, the scrollable element does not have to be `<ng-scrollbar>`.

```ts
import { SmoothScrollModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    // ...
    SmoothScrollModule
  ]
})
```

```html
<div smoothScroll #scrollable class="scrollable-container}">
  <!-- child elements -->
</div>

<button (click)="scrollable.scrollToBottom(500)">Scroll to bottom</button>
```

See all [Scroll Functions](#scroll-functions).

<a name="development"/>

## Development

This project uses the Angular CLI for building the library.

```bash
$ ng build ngx-scrollbar --prod
```

or

```bash
$ npm run build-lib
```

<a name="issues"/>

## Issues

If you identify any errors in the library, or have an idea for an improvement, please open an [issue](https://github.com/MurhafSousli/ngx-scrollbar/issues).

<a name="author"/>

## Author

- Murhaf Sousli [Github](https://github.com/MurhafSousli), [Twitter](https://twitter.com/MurhafSousli)

<a name="credit"/>

## Credit

- Inspired by [gemini-scrollbar](https://github.com/noeldelgado/gemini-scrollbar).

<a name="more-plugins"/>

## More plugins

- [ngx-sharebuttons](https://github.com/MurhafSousli/ngx-sharebuttons)
- [ngx-gallery](https://github.com/MurhafSousli/ngx-gallery)
- [ngx-progressbar](https://github.com/MurhafSousli/ngx-progressbar)
- [ngx-scrollbar](https://github.com/MurhafSousli/ngx-scrollbar)
- [ngx-bar-rating](https://github.com/MurhafSousli/ngx-bar-rating)
- [ngx-disqus](https://github.com/MurhafSousli/ngx-disqus)
- [ngx-wordpress](https://github.com/MurhafSousli/ngx-wordpress)
- [ngx-highlightjs](https://github.com/MurhafSousli/ngx-highlightjs)
- [ngx-teximate](https://github.com/MurhafSousli/ngx-teximate)
