## Material Select

When integrating with Material select, it's important to note that unlike other integration examples, you can't simply
wrap the control and assign an external viewport due to the nature of the dropdown menu being a CDK popup panel, which
isn't directly nested within the component.

However, you can still achieve the desired functionality by wrapping the content with a scrollbar component and
utilizing the `matSelectViewport` addon directive. This directive ensures that the selected item is scrolled to as soon
as the dropdown opens.

Here's how you can implement it:

```html
<mat-select>
  <ng-scrollbar matSelectViewport>
    @for (item of items; track item) {
      <mat-option [value]="item">
          {{ item }}
      </mat-option>
    }
  </ng-scrollbar>
</mat-select>
```

## Material Dialog

In a Material dialog, the `mat-dialog-content` component serves as the scrollable element with default padding.

To integrate with `ng-scrollbar`, we ensure it doesn't exceed the `mat-dialog-content` height and remove the padding
styles. Then, we apply padding to a content wrapper inside our scrollbar component.

```html
<h2 mat-dialog-title>Dialog Title</h2>

<mat-dialog-content class="mat-typography">
  <ng-scrollbar appearance="compact">
    <div class="content-wrapper">
      <!-- CONTENT -->
    </div>
  <ng-scrollbar>
</mat-dialog-content>
```

```scss
mat-dialog-content.mat-mdc-dialog-content {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
}

.ng-scrollbar {
  flex: 1;
}

// Add the padding to the content wrapper inside the scrollbar
.content-wrapper {
  padding: var(--mat-dialog-with-actions-content-padding, 20px 24px);
}
```

Here is an [integration with material dialog example](https://stackblitz.com/edit/ngx-scrollbar-tkzscf?file=package.json)

## CDK Virtual Scroll

```html
<ng-scrollbar externalViewport cdkVirtualScrollViewport>
  <cdk-virtual-scroll-viewport itemSize="100">
    <div *cdkVirtualFor="let item of items" class="card">
      {{ item }}
    </div>
  </cdk-virtual-scroll-viewport>
</ng-scrollbar>
```

## ngx-datatable table

```html
<ng-scrollbar externalViewport="datatable-body"
              externalContentWrapper="datatable-selection">
  <ngx-datatable class="material"
                 style="height: 400px"
                 [rows]="rows"
                 [columnMode]="columnMode"
                 [rowHeight]="50"
                 [scrollbarV]="true">
    <ngx-datatable-column name="Name"/>
  </ngx-datatable>
</ng-scrollbar>
```

## Ag-grid Table

```html
<ng-scrollbar externalViewport=".ag-center-cols-viewport"
              externalContentWrapper=".ag-center-cols-container">
  <ag-grid-angular style="height: 300px;"
                   class="ag-theme-quartz"
                   [rowData]="rowData"
                   [columnDefs]="colDefs"
                   [pagination]="true"/>
</ng-scrollbar>
```

## PrimeNg Scroller

```html
<ng-scrollbar externalViewport=".p-scroller"
              externalContentWrapper=".p-scroller-content"
              externalSpacer=".p-scroller-spacer"
              appearance="compact">
  <p-scroller [items]="cars"
              [itemSize]="50"
              scrollHeight="200px"
              styleClass="border-1 surface-border"
              [style]="{'width': '200px', 'height': '200px'}">
    <ng-template pTemplate="item" let-item>
      <div class="item">{{ item.vin }}</div>
    </ng-template>
  </p-scroller>
</ng-scrollbar>
```

## PrimeNg Table

```html
<ng-scrollbar externalViewport=".p-scroller"
              externalContentWrapper=".p-datatable-scrollable-table"
              appearance="compact">
  <p-table [columns]="cols"
           [value]="cars"
           [scrollable]="true"
           scrollHeight="250px"
           [virtualScroll]="true"
           [virtualScrollItemSize]="46">
    <ng-template pTemplate="header" let-columns>
      <tr>
        @for (col of columns; track col.header) {
          <th style="width: 25%;">{{ col.header }}</th>
        }
      </tr>
    </ng-template>
    <ng-template pTemplate="body"
                 let-rowData
                 let-columns="columns">
      <tr style="height:46px">
        @for (col of columns; track col.header) {
          <td>{{ rowData[col.field] }}</td>
        }
      </tr>
    </ng-template>
  </p-table>
</ng-scrollbar>
```

## PrimeNg Dropdown

When utilizing the scrollbar with the PrimeNG dropdown, the scrollbar component initializes, but the dropdown menu is
generated only upon user interaction (i.e., clicking the dropdown). To ensure the scrollbar correctly detects when the
dropdown menu is rendered, use the `asyncDetection="auto"` directive.

```html
<ng-scrollbar externalViewport=".p-dropdown-items-wrapper"
              externalContentWrapper=".p-dropdown-items"
              asyncDetection="auto">
  <p-dropdown [options]="cities"
              [(ngModel)]="selectedCity"
              optionLabel="name"
              [showClear]="true"
              placeholder="Select a City"/>
</ng-scrollbar>
```

## PrimeNg Dropdown (Virtual Scroll)

```html
<ng-scrollbar externalViewport=".p-scroller"
              externalContentWrapper=".p-scroller-content"
              externalSpacer=".p-scroller-spacer"
              asyncDetection="auto">
  <p-dropdown [options]="cars"
              [(ngModel)]="selectedCar"
              placeholder="Select Option"
              optionLabel="brand"
              [virtualScroll]="true"
              [virtualScrollItemSize]="40"/>
</ng-scrollbar>
```

## Kendu UI Grid

```html
<ng-scrollbar externalViewport=".k-grid-content"
              externalContentWrapper=".k-grid-table"
              externalSpacer=".k-height-container">
  <kendo-grid scrollable="virtual">
      ...
  </kendo-grid>
</ng-scrollbar>
```

```scss
.k-height-container {
  position: absolute !important;
}
```

Here is
a [Kendu UI grid example stackblitz](https://stackblitz.com/edit/angular-vgzffw-ldgsyr?file=src%2Fapp%2Fapp.component.ts,src%2Fstyles.css)
