import { Component, ElementRef, Signal, viewChild, ViewChild } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { NgScrollbarExt, SyncSpacer } from 'ngx-scrollbar';
import { afterTimeout } from './common-test.';

@Component({
  selector: 'sample-content',
  imports: [NgScrollbarExt, SyncSpacer],
  template: `
    <ng-scrollbar externalViewport=".my-custom-viewport"
                  externalContentWrapper=".my-custom-content-wrapper"
                  externalSpacer=".my-custom-spacer"
                  appearance="compact"
                  syncSpacer
                  style="width: 100px; height: 100px">
      <div class="some-wrapper">
        <div class="my-custom-viewport">
          <div class="my-custom-content-wrapper" style="width: 100px; height: 200px"></div>
          <div class="my-custom-spacer" style="position: absolute; left: 0; top: 0; height: 50000px"></div>
        </div>
      </div>
    </ng-scrollbar>
  `
})
class SampleComponent {
  @ViewChild('sample') content: ElementRef<HTMLElement>;
  scrollbar: Signal<NgScrollbarExt> = viewChild(NgScrollbarExt);
  sample: Signal<ElementRef<HTMLElement>> = viewChild('sample');
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;
}

describe('External viewport with [SyncSpacer]', () => {
  let fixture: ComponentFixture<SampleComponent>;
  let component: SampleComponent;
  let scrollbarCmp: NgScrollbarExt;

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleComponent);
    component = fixture.componentInstance;
    scrollbarCmp = component.scrollbar();
    fixture.detectChanges();
  });

  it('[SyncSpacer] should sync spacer dimension with content dimension', async () => {
    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));

    // Verify that only the vertical scrollbar is shown
    expect(scrollbarCmp.verticalUsed()).toBeTrue();
    expect(scrollbarCmp.isVerticallyScrollable()).toBeTrue();
    expect(scrollbarCmp.horizontalUsed()).toBeFalse();
    expect(scrollbarCmp.isHorizontallyScrollable()).toBeFalse();

    // Change the content size to trigger spacer resize event
    scrollbarCmp.contentWrapperElement().style.setProperty('width', '200px');
    // Wait for content wrapper resize observer to pick the change
    await afterTimeout(30);
    // Set the new spacer dimension
    fixture.detectChanges();
    // Wait for spacer resize observer to pick the change
    await afterTimeout(30);

    expect(scrollbarCmp.horizontalUsed()).toBeTrue();
    expect(scrollbarCmp.isHorizontallyScrollable()).toBeTrue();
    expect(scrollbarCmp.spacerElement().clientWidth).toBe(200);

    // Change the content size to trigger spacer resize event
    scrollbarCmp.contentWrapperElement().style.setProperty('width', '100px');
    // Wait for content wrapper resize observer to pick the change
    await afterTimeout(30);
    // Set the new spacer dimension
    fixture.detectChanges();
    // Wait for spacer resize observer to pick the change
    await afterTimeout(30);

    expect(scrollbarCmp.horizontalUsed()).toBeFalse();
    expect(scrollbarCmp.isHorizontallyScrollable()).toBeFalse();
    expect(scrollbarCmp.spacerElement().clientWidth).toBe(100);
  });
});
