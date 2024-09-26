The `scrollViewport` directive allows you to use a custom viewport element in your template. It is used for integration with other libraries where the viewport can be another component or directive.
 
### Basic usage

```html
<ng-scrollbar>
  <div scrollViewport class="custom-viewport">
    <div class="scroll-content-wrapper">
       <!-- content -->
    </div>
  </div>
</ng-scrollbar>
```

> **NOTE**: `scrollViewport` directive must be used on the direct child of `<ng-scrollbar>`

> **NOTE**: When `scrollViewport` directive is used on an element, It is recommended that its host element to have one and only one child element that acts as a content wrapper _(like `.scroll-content-wrapper` in the above example)_, this content wrapper will be used by the ResizeObserver API to observes content changes and updates the UI accordingly.

> **IMPORTANT NOTE:** Some external libraries can cause the scrollbar to recalculate very frequently when it scrolls, which can result in flickering behaviour (like the CDK virtual scroll viewport).
   To avoid this, set `[autoHeightDisabled]="true"`

### Integrate with [ngx-infinite-scroll](https://github.com/orizens/ngx-infinite-scroll).

```html
<ng-scrollbar>
  <div infiniteScroll [scrollWindow]="false" scrollViewport>
    <mat-list>
      <mat-list-item class="example-item" *ngFor="let i of array">
        {{ i }}
      </mat-list-item>
    </mat-list>
  </div>
</ng-scrollbar>
```

### Integrate with [CDK Scrollable](https://material.angular.io/cdk/scrolling/overview#cdkscrollable-and-scrolldispatcher)

If you need to get hold of the scrollable element of the component, you can add a child element and then assign it with `scrollViewport` directive

```html
<ng-scrollbar>
  <div scrollViewport cdkScrollable>
     <!-- CONTENT -->
  </div>
</ng-scrollbar>
```

### Integrate with [CDK VirtualScroll](https://material.angular.io/cdk/scrolling/overview#virtual-scrolling).


```html
<ng-scrollbar>
  <cdk-virtual-scroll-viewport itemSize="50" scrollViewport>
    <div *cdkVirtualFor="let item of items">{{item}}</div>
  </cdk-virtual-scroll-viewport>
</ng-scrollbar>
```

### Integrate with [CDK Drag and Drop](https://material.angular.io/cdk/drag-drop/overview)

```html
<ng-scrollbar track="horizontal" appearance="standard">

  <div class="tabs"
       scrollViewport
       #tabDropList="cdkDropList" 
       dropListScroller 
       cdkDropList 
       cdkDropListLockAxis="x" 
       cdkDropListOrientation="horizontal"
       [cdkDropListAutoScrollDisabled]="true"
       (cdkDropListDropped)="drop($event)">

    <div class="tab" *ngFor="let tab of tabs" 
                     [ngClass]="{ selected: selectedTab === tab.id }" 
                     cdkDrag 
                     [cdkDragData]="tab"
                     (cdkDragStarted)="onDragStarted($event)"
		     (mousedown)="selectedTab = tab.id"
                     (click)="onSelectTab(tab)">
      <span class="tab-label">{{ tab.label }}</span>
      <span class="tab-close pi pi-times"></span>
    </div>

  </div>
</ng-scrollbar>
```
```scss
ng-scrollbar {
  height: 70px;
  width: 100%;
}
```

Demo: https://stackblitz.com/edit/ngx-scrollbar-cdk-drag-drop