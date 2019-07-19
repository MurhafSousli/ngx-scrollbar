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

Custom overlay-scrollbars with native scrolling mechanism for Angular.

___

## Table of Contents

- [Live Demo](https://MurhafSousli.github.io/ngx-scrollbar/)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Scroll Functions](#scroll-functions)
- [Styling](#styling)
- [Update scrollbars manually](#manual-update)
- [Resize Sensor Feature](#resize-sensor)
- [Integration](#integration)
  - [CDK Virtual Scroll Example](#virtual-scroll)
  - [Infinite Scroll Example](#infinite-scroll)
- [Web Worker (experimental)](#web-worker)
- [Smooth Scroll Module](#smooth-scroll)
- [Development](#development)
- [Issues](#issues)
- [Author](#author)
- [More plugins](#more-plugins)

 > Version 5 is written from scratch, A lot of improvements and fixes.
I highly recommend you to upgrade to the latest version


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
    NgScrollbarModule
  ]
})
```

In your template

```html
<ng-scrollbar>
  <!-- Your Content -->
</ng-scrollbar>
```

It also works as a directive

```html
<div ng-scrollbar>
  <!-- Your Content -->
</div>

<div ngScrollbar>
  <!-- Your Content -->
</div>
```

Here is a [stackblitz](https://stackblitz.com/edit/ngx-scrollbar)

<a name="options">

## Options

### Scrollbar inputs

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

***

 > Because it is not possible to hide the native scrollbars on mobile browsers, the only solution is to fallback to the native scrollbars.
 > *To disable this option give it false value.*

***

<a name="scroll-function"> 

### Scrollbar functions

To use *NgScrollbar* functions, you will need to get the component reference from the template. this can be done using the `@ViewChild` decorator, for example:

```ts
@ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;
```

**Example:** Subscribe to `NgScrollbar` scroll event

```ts
@ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

ngAfterViewInit() {
  this.scrollbarRef.scrollable.elementScrolled().subscribe(e => console.log(e))
}
```

We use the property `ScrollbarRef.scrollable` to get the scroll event, See [CdkScrollable API](https://material.angular.io/cdk/scrolling/api#CdkScrollable).

 > Note: in order to avoid hitting change detection for every scroll event, all of the events emitted from this stream will be run outside the Angular zone. If you need to update any data bindings as a result of a scroll event, you have to run the callback using `NgZone.run`.

This means that if you are using the scroll event to update the UI, you will need to use `ngZone`.

**Example:** Change header title on scroll event

```ts
@Component({
  selector: 'app-page-title',
  template: `
    <ng-scrollbar>
      <div class="page-title" [style.fontSize]="size$ | async">
        <h1>Hello World</h1>
      </div>   
      
      <div [innerHTML]="longScrollableText"></div>
    </ng-scrollbar>
  `
})
export class PageTitleComponent {

  // Stream that will update title font size on scroll down
  size$ = new Subject();

  // Unsubscriber for elementScrolled stream.
  unsubscriber$ = Subscription.EMPTY;

  // Get NgScrollbar reference
  @ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;
  
  // long text that make ng-scrollbar scrollable
  longScrollableText = `...`
  
  constructor(private ngZone: NgZone) {
  }
  
  ngAfterViewInit() {
    // Subscribe to <ng-scrollbar> scroll event
    this.unsubscriber$ = this.scrollbarRef.scrollable.elementScrolled().pipe(
      map((e: any) => e.target.scrollTop > 50 ? '0.75em' : '1em'),
      tap((size: string) => this.ngZone.run(() => this.size$.next(size)))
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.unsubscriber$.unsubscribe();
  }
}
```

Check out the example in this [stackblitz](https://stackblitz.com/edit/ngx-scrollbar?file=src%2Fapp%2Fscroll-event%2Fscroll-event%2Fscroll-event.component.ts)

<a name="">
## Scrolling functions

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

```ts
@ViewChild(NgScrollbar) ngScrollbar: NgScrollbar;

updateScrollbar(code: string) {
  this.ngScrollbar.detectChanges();
}
```

<a name="styling"/>

## Styling

You can customize the scrollbar styles from the following CSS variables

```html
<ng-scrollbar class="my-scrollbar">
  <!-- scrollable content -->
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
  <!-- scrollable content -->
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
<a name="integration"/>

## Integration

The `ScrollView` directive allows you to set use custom viewport element in your template.

 > Note: `scrollView` directive works only when custom viewport is a child of `<ng-scrollbar>`
 
### Basic usage

```html
<ng-scrollbar>
  <div scrollView class="my-custom-viewport">
    <div>{{scrollableContent}}</div>
  </div>
</ng-scrollbar>
```

<a name="virtual-scroll"/>
### Virtual Scroll Example

To use virtual scroll, just add the `scrollbarView` directive on the `<cdk-virtual-scroll-viewport>`.

**Example:**

```html
<ng-scrollbar>
  <cdk-virtual-scroll-viewport scrollView itemSize="50">
    <div *cdkVirtualFor="let item of items">{{item}}</div>
  </cdk-virtual-scroll-viewport>
</ng-scrollbar>
```

<a name="infinite-scroll"/>

### Infinite Scroll Example with [ngx-infinite-scroll](https://github.com/orizens/ngx-infinite-scroll).

```html
<ng-scrollbar>
  <mat-list scrollView infiniteScroll [scrollWindow]="false">
    <mat-list-item class="example-item" *ngFor="let i of array">
      {{ i }}
    </mat-list-item>
  </mat-list>
</ng-scrollbar>
```

<a name="smooth-scroll"/>

## Smooth Scroll Module

The smooth scroll is available as an independent module `SmoothScrollModule`, you can use smooth scroll function on any scrollable element even if it is not `<ng-scrollbar>`.

**SmoothScrollModule** provides `SmoothScroll` a directive for template usage and a `SmoothScrollManager` service for code usage

 > You don't need to use this module with `<ng-scrollbar>` because the smooth scroll functionality is already built-in the component.

### Usage

Import `SmoothScrollModule` in your module

```ts
import { SmoothScrollModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    SmoothScrollModule
  ]
})
```

### `SmoothScroll` directive example

```html
<div smoothScroll #scrollable="smoothScroll" class="scrollable-container">
  <div>{{scrollableContent}}</div>
</div>

<button (click)="scrollable.scrollToBottom(500)">Scroll to bottom</button>
```

### `SmoothScrollManager` service example

```ts
@Component({...})
export class FooComponent {
  constructor(private el: ElementRef, private smoothScroll: SmoothScrollManager) {
  }
  scrollTop() {
    this.smoothScroll.scrollToTop(this.el.nativeElement, 800);
  }
}
```

See all [Scroll Functions](#scroll-functions).

<a name=""/>

## Web worker (experimental)

Tried to move the calculation logic to a web worker to lift up some checks from the main UI thread.
The web worker works automatically when you add `webworker` directive, option is built-in using a workaround.

When scroll event emits, the component sends the latest state to the web worker, the web worker function calculates and emit the result back to the component.
Here there is a cost of serialization and deserialization every time the scroll event emits.

Honestly, there is not a noticeable improve in performance on desktop or mobile when I tried it with the web worker.

But testing the performance with chrome dev tools, show the following result:

Do you think web worker is useful in this package?

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
