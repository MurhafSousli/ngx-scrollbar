# Regarding the scroll event

By default, the scroll event is used to do the necessary calculation to display the custom scrollbars.

You may want to tweak the scroll event if it is not performing well on low-end devices.

You can throttle the scroll event using the `scrollAuditTime` option, `20` milliseconds seems to be a reasonable value.

**Example:**

Set the option `[scrollAuditTime]` for a specific scrollbar component.

```html
<ng-scrollbar [scrollAuditTime]="20">
  <!-- ...content... -->
</ng-scrollbar>
```

**Example:**

Set the `scrollAuditTime` option for all custom scrollbars using the global options.

```ts
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

@NgModule({
  imports: [
    NgScrollbarModule
  ],
  providers: [
    { 
       provide: NG_SCROLLBAR_OPTIONS,
       useValue: {
          scrollAuditTime: 20
       }
    }
  ]
})
```

_This option is available in `ngx-scrollbar >= v7.1.0`_

# Regarding the `auto-height` and `auto-width` features

When any of these features is turned on, the scrollbar will re-calculate when the component size or the content size change.

If the scrollbar is used with other library that frequently changes the content or the component size, it could cause a performance issue, therefore, you should turn them off.

For example when using it with a virtual scroll library, you should set `[autoHeightDisabled]="true"` (which is already disabled by default).