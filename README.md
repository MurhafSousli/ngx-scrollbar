<p align="center">
  <img height="200px" width="200px" style="text-align: center;" src="src/assets/logo.svg?raw=true">
  <h1 align="center">Angular Custom Scrollbar</h1>
</p>

Custom overlay-scrollbars with native scrolling mechanism for Angular
___
[![npm](https://img.shields.io/badge/demo-online-ed1c46.svg)](https://murhafsousli.github.io/ngx-scrollbar/)
[![npm](https://img.shields.io/npm/v/ngx-scrollbar.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/ngx-scrollbar)
[![Build Status](https://travis-ci.org/MurhafSousli/ngx-scrollbar.svg?branch=master)](https://www.npmjs.com/package/ngx-scrollbar)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](/LICENSE)

## Table of Contents

- [Live Demo](https://MurhafSousli.github.io/ngx-scrollbar/)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Scroll To](#scrollto)
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

### Scrollbar inputs

- **[autoHide]**: boolean

  Hide scrollbars, and show them on hover, default `false`

- **[trackX]**: boolean

  Horizontal scrollbar, default `false`

- **[trackY]**: boolean

  Vertical scrollbar, default `true`

- **[autoUpdate]**: boolean

  Auto-update scrollbars on content changes, default: `true`

- **[viewClass]**: string

  Add custom class to the view

- **[barClass]**: string

  Add custom class to scrollbars

- **[thumbClass]**: string

  Add custom class to scrollbars' thumbnails

### Scrollbar functions

- **update()**

Update scrollbars manually when content changes

- **scrollXTo(position: number, duration?: number)**

Scroll element horizontally where position is `left` in px and duration is in milliseconds.

- **scrollYTo(position: number, duration?: number)**

Scroll element vertically where position is `top` in px and duration is in milliseconds.

<a name="scrollto">

## Scroll the view dynamically

Scrollbar component has 2 helper functions that allow you to scroll the view to a specific position

```ts
// scroll horizontally
scrollElement.scrollXTo(position, duration?);

// scroll vertically
scrollElement.scrollYTo(position, duration?);
```

It can be used directly from the template

```html
<ng-scrollbar #scrollEl>
  <!-- Content -->
</ng-scrollbar>

<button (click)="scrollEl.scrollYTo(0)">Scroll to top</button>
```

Or use the `ViewChild` decorator to get a reference of the scrollbar component 

```ts
@ViewChild(ScrollbarComponent) scrollEl: ScrollbarComponent;

scrollToTop() {
   this.scrollEl.scrollYTo(0);
}
```

#### Scroll to top on route change

```ts
export class AppComponent implements OnInit {

  @ViewChild(ScrollbarComponent) scrollEl: ScrollbarComponent;

  constructor(private router: Router) {
  }

  ngOnInit() {

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        if (this.scrollEl) {
          this.scrollEl.scrollYTo(0);
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
- [ng-gallery](https://github.com/MurhafSousli/ng-gallery)
- [ngx-progressbar](https://github.com/MurhafSousli/ngx-progressbar)
- [ngx-scrollbar](https://github.com/MurhafSousli/ngx-scrollbar)
- [ngx-bar-rating](https://github.com/MurhafSousli/ngx-bar-rating)
- [ngx-disqus](https://github.com/MurhafSousli/ngx-disqus)
- [ngx-wordpress](https://github.com/MurhafSousli/ngx-wordpress)
- [ngx-highlightjs](https://github.com/MurhafSousli/ngx-highlightjs)
- [ng-teximate](https://github.com/MurhafSousli/ng-teximate)