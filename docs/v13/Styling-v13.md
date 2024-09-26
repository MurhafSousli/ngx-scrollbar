The scrollbars can be easily customized using the CSS variables

```html
<ng-scrollbar class="my-scrollbar">
  <!-- content -->
</ng-scrollbar>
```

Here are all available CSS variables:

```scss
.my-scrollbar {
  --scrollbar-border-radius: 7px;
  --scrollbar-padding: 4px;
  --scrollbar-viewport-margin: 0;
  --scrollbar-track-color: transparent;
  --scrollbar-wrapper-color: transparent;
  --scrollbar-thumb-color: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover-color: var(--scrollbar-thumb-color);
  --scrollbar-size: 5px;
  --scrollbar-hover-size: var(--scrollbar-size);
  --scrollbar-thumb-transition: height ease-out 150ms, width ease-out 150ms;
  --scrollbar-track-transition: height ease-out 150ms, width ease-out 150ms;
}
```

If the CSS variables are not enough, custom classes can be used to override the styles, here is an example:

```html
<ng-scrollbar trackClass="scrollbar" thumbClass="scrollbar-thumb">
  <!-- content -->
</ng-scrollbar>
```

```scss
::ng-deep {
  .scrollbar {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
  .scrollbar-thumb {
    background-color: rgba(161, 27, 27, 0.4);
  }
}
```