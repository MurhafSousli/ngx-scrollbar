import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { NgScrollbarExt, SyncSpacer } from 'ngx-scrollbar';
import { afterTimeout } from './common-test.';
import { ScrollViewport } from '../viewport';

@Component({
  selector: 'sample-content',
  imports: [NgScrollbarExt, SyncSpacer],
  template: `
    <ng-scrollbar externalViewport=".my-custom-viewport"
                  externalContentWrapper=".my-custom-content-wrapper"
                  externalSpacer=".my-custom-spacer"
                  appearance="compact"
                  syncSpacer>
      <div class="my-custom-viewport" style="width: 100px; height: 100px">
        <div class="my-custom-content-wrapper" [style.width.px]="contentWidth" style="height: 200px"></div>
        <div class="my-custom-spacer" style="height: 50000px"></div>
      </div>
    </ng-scrollbar>
  `
})
class TestComponent {
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;
  contentWidth: number = 100;
}

describe('External viewport with [SyncSpacer]', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let scrollbarCmp: NgScrollbarExt;
  let viewportCmp: ScrollViewport;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    scrollbarCmp = fixture.debugElement.query(By.directive(NgScrollbarExt)).componentInstance;
    fixture.detectChanges();
  });

  it('[SyncSpacer] should sync spacer dimension with content dimension',  fakeAsync( async () => {
    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));
    viewportCmp = fixture.debugElement.query(By.directive(ScrollViewport)).componentInstance;

    // Verify that only the vertical scrollbar is shown
    expect(viewportCmp.verticalUsed()).toBeTrue();
    expect(viewportCmp.isVerticallyScrollable()).toBeTrue();
    expect(viewportCmp.horizontalUsed()).toBeFalse();
    expect(viewportCmp.isHorizontallyScrollable()).toBeFalse();

    // Change the content size
    component.contentWidth = 200;
    fixture.detectChanges();
    // Wait for content wrapper to resize
    await fixture.whenStable();

    // Trigger detection again for the mutation observer
    fixture.detectChanges();
    // Wait for content wrapper resize observer to pick the change
    await afterTimeout(16);

    expect(viewportCmp.horizontalUsed()).toBeTrue();
    expect(viewportCmp.isHorizontallyScrollable()).toBeTrue();
    expect(scrollbarCmp.spacerElement().clientWidth).toBe(200);

    // Change the content size to trigger spacer resize event
    component.contentWidth = 100;
    fixture.detectChanges();
    // Need another timeout for some reason
    await afterTimeout( 16);
    // Wait for content wrapper to resize
    await fixture.whenStable();

    // Set the new spacer dimension
    fixture.detectChanges();
    // Wait for content wrapper resize observer to pick the change
    await afterTimeout( 16);

    expect(viewportCmp.horizontalUsed()).toBeFalse();
    expect(viewportCmp.isHorizontallyScrollable()).toBeFalse();
    expect(scrollbarCmp.spacerElement().clientWidth).toBe(100);
  }));
});
