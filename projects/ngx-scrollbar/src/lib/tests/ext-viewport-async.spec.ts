import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, input, InputSignal, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbarExt, NgScrollbarModule, ViewportAdapter } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { afterTimeout } from './common-test.';

@Component({
  selector: 'sample-lib',
  template: `
    @if (show()) {
      <div class="my-custom-viewport" style="background:green; width: 100px; height: 100px">
        @if (showContentWrapper()) {
          <div class="my-custom-content-wrapper" style="width: 500px; height: 500px; background: red">
            <div class="content-sample" style="width: 500px; height: 500px; background: red">Content Sample</div>
          </div>
        }
        @if (showSpacer()) {
          <div class="my-custom-spacer"></div>
        }
      </div>
    }
  `
})
class SampleLibComponent {
  show: InputSignal<boolean> = input();
  showContentWrapper: InputSignal<boolean> = input();
  showSpacer: InputSignal<boolean> = input();
}

@Component({
  imports: [NgScrollbarModule, SampleLibComponent],
  template: `
    <ng-scrollbar [externalViewport]="externalViewport"
                  [externalContentWrapper]="externalContentWrapper"
                  [externalSpacer]="externalSpacer"
                  [asyncViewport]="asyncDetection">
      <sample-lib [show]="showViewport()"
                  [showContentWrapper]="showContentWrapper()"
                  [showSpacer]="showSpacer()"/>
    </ng-scrollbar>
  `
})
class TestComponent {
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;
  asyncDetection: '' | 'auto';

  showViewport = signal(false);
  showContentWrapper = signal(true);
  showSpacer = signal(true);
}

describe('<ng-scrollbar externalViewport asyncViewport>', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let scrollbarCmp: NgScrollbarExt;
  let adapter: ViewportAdapter;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    const scrollbarFixture: DebugElement = fixture.debugElement.query(By.directive(NgScrollbarExt));
    scrollbarCmp = scrollbarFixture.componentInstance;
    adapter = scrollbarFixture.injector.get(ViewportAdapter);
  });

  it('[externalViewport]', async () => {
    component.externalViewport = '.my-custom-viewport';

    expect(scrollbarCmp.skipInit).toBe(true);
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showViewport.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();
  });

  it('[externalViewport] [externalContentWrapper]', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';

    expect(scrollbarCmp.skipInit).toBe(true);
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showViewport.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();
  });

  it('[externalViewport] [externalContentWrapper] [externalSpacer]', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';

    expect(scrollbarCmp.skipInit).toBe(true);
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showViewport.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();
  });

  it('[asyncDetection="auto"] should detect viewport removal', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    component.asyncDetection = 'auto';

    expect(scrollbarCmp.skipInit).toBe(true);
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showViewport.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();

    // Mock library removes the content (such as dropdown)
    component.showViewport.set(false);
    await afterTimeout(100);
    expect(scrollbarCmp.viewportRef).toBeNull();
  });

  it('[asyncDetection="auto"] should detect content wrapper removal', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    component.asyncDetection = 'auto';

    expect(scrollbarCmp.skipInit).toBe(true);
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showViewport.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();

    // Mock library removes the content (such as dropdown)
    component.showContentWrapper.set(false);
    await afterTimeout(100);
    expect(scrollbarCmp.viewportRef).toBeNull();
  });

  it('[asyncDetection="auto"] should detect spacer removal', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    component.asyncDetection = 'auto';

    expect(scrollbarCmp.skipInit).toBe(true);
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showViewport.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();

    // Mock library removes the content (such as dropdown)
    component.showSpacer.set(false);
    await afterTimeout(100);
    expect(scrollbarCmp.viewportRef).toBeNull();
  });
});
