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
- [Dynamic scrolling](#scrollto)
- [Styling](#styling)
- [Smooth scroll](#smoothscroll)
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

- **[autoHide]**: boolean

  Show scrollbar on mouse hover only, default `false`

- **[autoUpdate]**: boolean

  Auto-update scrollbars on content changes, default: `true`

- **[viewClass]**: string

  Add custom class to the view, default: `null`

- **[barClass]**: string

  Add custom class to scrollbars, default: `null`

- **[thumbClass]**: string

  Add custom class to scrollbars' thumbnails, default: `null`
  
- **[scrollToDuration]**: number

  The smooth scroll duration when a scrollbar is clicked, default `400`.
  
- **[disableOnBreakpoints]**: Array of the CDK Breakpoints

  Disable custom scrollbars on specific breakpoints, default: `[Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait]`

 > Because it is not possible to hide the native scrollbars on mobile browsers, the only solution is to fallback to the native scrollbars, to disable this option give it false value.

#### Update scrollbars manually

By default the input `[autoUpdate]` is true, which uses the `MutationObserver` to observe child elements changes and update the sizes of the scrollbars, however this does not include text changes so if you want to update the scrollbars on text changes, then you need to do that manually.

##### Dynamic text example:

```ts
Component({
  selector: 'text-area-example',
  template: `
    <ng-scrollbar>
      <div class="text-content">
        {{text}}
      </div>
    </ng-scrollbar>
  `
})
export class AppComponent implements OnInit { 
   @ViewChild(NgScrollbar) textScrollbar: NgScrollbar;

   setText(value: string) {
     this.text = value;
     // wait for the new text value to render before updating the scrollbar
     setTimeout(() => {
       this.textScrollbar.update();
     }, 200);
   }
}
```

##### Text area example:

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
   @ViewChild(NgScrollbar) textScrollbar: NgScrollbar;

   setText(value: string) {
     this.text = value;
     // wait for the new text value to render before updating the scrollbar
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

### Scrollbar functions

To use *NgScrollbar* functions, you will need to get the component reference from the template. this can be done using the `@ViewChild` decorator, for example:

```ts
@ViewChild(NgScrollbar) scrollRef: NgScrollbar;
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
scrollRef.scrollToElement(selector, duration?, easeFunc?).subscribe()
```

- **Selector:** target element selector.
- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

#### Scroll horizontally

```ts
scrollRef.scrollXTo(position, duration?, easeFunc?).subscribe()
```

- **Position:** scrolling position on X axis in pixels.
- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

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

- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

#### Scroll to bottom

```ts
scrollRef.scrollToBottom(duration?, easeFunc?).subscribe()
```

- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

#### Scroll to left

```ts
scrollRef.scrollToLeft(duration?, easeFunc?).subscribe()
```

- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

#### Scroll to right

Observable that emits once scrolling to right is done

```ts
scrollRef.scrollToRight(duration?, easeFunc?).subscribe(() => {
  console.log('scrollToRight is done')
})
```

- **Duration:** time to reach position in milliseconds, default null.
- **EaseFunc:** the easing function for the smooth scroll.

<a name="scrollto">

## Dynamic scrolling example

Scroll to top directly from the template

```html
<ng-scrollbar #scrollbarRef>
  <!-- Content -->
</ng-scrollbar>

<button (click)="scrollbarRef.scrollToTop(500)">Scroll to top</button>
```

Or using the `@ViewChild` decorator

```ts
@ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;

scrollToTop() {
   this.scrollRef.scrollToElement('#usage');
}
```

### Scroll to top on route change

```ts
export class AppComponent implements OnInit {

  @ViewChild(NgScrollbar) scrollRef: NgScrollbar;

  constructor(private router: Router) {
  }

  ngOnInit() {

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        if (this.scrollRef) {
          this.scrollRef.scrollToTop();
        }
      });
  }

}
```

<a name="styling"/>

## Styling

The easiest way to use custom styles is to give each part of the scrollbar a custom class

```html
<ng-scrollbar barClass="scroll-bar" thumbClass="scroll-thumbs">
  <!-- child elements... -->
</ng-scrollbar>
```
```scss
.scroll-bar {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border-radius: 4px;
}
.scroll-thumbs {
  background-color: rgba(161, 27, 27, 0.4) !important;
  &:hover,
  &:active {
    background-color: rgba(161, 27, 27, 0.7) !important;
  }
}
```


<a name="smoothscroll"/>

## Smooth Scroll Module

Since v3.0.0, The `SmoothScrollModule` is added as an independent module, the scrollable element does not have to be `<ng-scrollbar>`.

```ts
import { SmoothScrollModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    // ...
    SmoothScrollModule
  ]
})
```

Use the `[smoothScroll]` directive on a scrollable container.

```html
<div smoothScroll #scrollable class="scrollable-container}">
  <!-- child elements -->
</div>

<button (click)="scrollable.scrollToBottom(500)">Scroll to bottom</button>
```

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
