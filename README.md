# Angular Custom Scrollbar

Custom overlay-scrollbars with native scrolling mechanism for Angular
___
[![npm](https://img.shields.io/badge/demo-online-ed1c46.svg)](https://murhafsousli.github.io/ngx-scrollbar/)
[![npm](https://img.shields.io/npm/v/ngx-scrollbar.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/ngx-scrollbar) 
[![Build Status](https://travis-ci.org/MurhafSousli/ngx-scrollbar.svg?branch=master)](https://www.npmjs.com/package/ngx-scrollbar) 
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](/LICENSE)

## Table of Contents 
 
 - [Live Demo](https://MurhafSousli.github.io/ngx-scrollbar)
 - [Installation](#installation)
 - [Usage](#usage) 
 - [Issues](#issues)    
 - [Author](#author)
 - [Credit](#credit)

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
<ng-scrollbar [style.height.px]="500">
  <!-- Content -->
</ng-scrollbar>
```

The component should have a fixed height


 - **[autoHide]**: boolean

  Hide scrollbars, and show them on hover, default `false`

 - **[trackX]**: boolean

  Horizontal scrollbar, default `false`

 - **[trackY]**: boolean

  Vertical scrollbar, default `true`


<a name="issues"/>

## Issues

If you identify any errors in the library, or have an idea for an improvement, please open an [issue](https://github.com/MurhafSousli/ngx-scrollbar/issues). I am excited to see what the community thinks of this project, and I would love your input!

<a name="author"/>

## Author

 - [github/murhafsousli](https://github.com/MurhafSousli)
 - [twitter/murhafsousli](https://twitter.com/MurhafSousli)

<a name="credit"/>

## Credit 

 - Inspired by [gemini-scrollbar](https://github.com/noeldelgado/gemini-scrollbar) by [Noel Delgado](http://pixelia.me/)
