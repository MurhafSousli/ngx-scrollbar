<p align="center">
  <img height="200px" width="200px" style="text-align: center;" src="https://cdn.rawgit.com/MurhafSousli/ngx-scrollbar/ee4c0ba4/src/assets/logo.svg">
  <h1 align="center">Angular Custom Scrollbar</h1>
</p>

[![npm](https://img.shields.io/badge/demo-online-ed1c46.svg)](https://murhafsousli.github.io/ngx-scrollbar/)
[![npm](https://img.shields.io/npm/v/ngx-scrollbar.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/ngx-scrollbar)
[![Build Status](https://travis-ci.org/MurhafSousli/ngx-scrollbar.svg?branch=master)](https://www.npmjs.com/package/ngx-scrollbar)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](/LICENSE)

Custom overlay-scrollbars with native scrolling mechanism for Angular

___

## Table of Contents

- [Live Demo](https://MurhafSousli.github.io/ngx-scrollbar/)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Dynamic scrolling](#scrollto)
- [Development](#development)
- [Issues](#issues)
- [Author](#author)
- [Credit](#credit)
- [More plugins](#more-plugins)

<a name="installation"/>

## Installation

Install it with npm

`npm install ngx-scrollbar --save`

### SystemJS

If you are using SystemJS, you should also adjust your configuration to point to the UMD bundle.

In your systemjs config file, map needs to tell the System loader where to look for `ngx-scrollbar`:

```js
map: {
  'ngx-scrollbar': 'node_modules/ngx-scrollbar/bundles/ngx-scrollbar.umd.js',
}
```

Here is a [stackblitz](https://stackblitz.com/edit/ngx-scrollbar)

<a name="usage"/>

## Usage

Import `ScrollbarModule` in the root module

```js
import { ScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  imports: [
    // ...
    ScrollbarModule
  ]
})
```

In your template

```html
<ng-scrollbar>
  <!-- Content -->
</ng-scrollbar>
```

<a name="options">

## Options

### Scrollbar inputs

- **[trackX]**: boolean

  Horizontal scrollbar, default `false`

- **[trackY]**: boolean

  Vertical scrollbar, default `true`

- **[autoHide]**: boolean

  Hide scrollbars, and show them on hover, default `false`

- **[autoUpdate]**: boolean

  Auto-update scrollbars on content changes, default: `true`

- **[viewClass]**: string

  Add custom class to the view

- **[barClass]**: string

  Add custom class to scrollbars

- **[thumbClass]**: string

  Add custom class to scrollbars' thumbnails
  
- **(scrollState)**:

  Stream that emits that component has been scrolled.

### Scrollbar functions

To use *Scrollbar* functions, you will need to get the component reference from the template. this can be done  using the `@ViewChild` decortator, for example:

```ts
@ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;
```

#### Update scrollbars manually

```ts
scrollRef.update()
```

#### Scroll horizontally

```ts
scrollRef.scrollXTo(position, duration?)
```

- **Position:** scrolling position on X axis in pixels.
- **Duration:** time to reach position in milliseconds, default 200ms.

#### Scroll vertically

```ts
scrollRef.scrollYTo(position, duration?)
```

- **Position:** scrolling position on Y axis in pixels.
- **Duration:** time to reach position in milliseconds, default 200ms.

<a name="scrollto">

## Dynamic scrolling example

Scroll to top directly from the template

```html
<ng-scrollbar #scrollRef>
  <!-- Content -->
</ng-scrollbar>

<button (click)="scrollRef.scrollYTo(0)">Scroll to top</button>
```

Or using the `@ViewChild` decorator

```ts
@ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;

scrollToTop() {
   this.scrollRef.scrollYTo(0);
}
```

### Scroll to top on route change

```ts
export class AppComponent implements OnInit {

  @ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;

  constructor(private router: Router) {
  }

  ngOnInit() {

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        if (this.scrollRef) {
          this.scrollRef.scrollYTo(0);
        }
      });
  }

}
```

<a name="development"/>

## Development

This project uses [ng-packagr](https://github.com/dherges/ng-packagr) for development.

Use the following command to build

```bash
$ npm run packagr
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
- [ng-teximate](https://github.com/MurhafSousli/ng-teximate)
