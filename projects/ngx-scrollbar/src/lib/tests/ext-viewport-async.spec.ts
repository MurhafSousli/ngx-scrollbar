import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, input, InputSignal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbarExt, NgScrollbarModule, ViewportAdapter } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'sample-lib',
  template: `
    @if (show()) {
      <div class="my-custom-viewport" style="background:green; width: 100px; height: 100px">
        <div class="my-custom-content-wrapper" style="width: 500px; height: 500px; background: red">
          <div class="content-sample" style="width: 500px; height: 500px; background: red">Content Sample</div>
        </div>
        <div class="my-custom-spacer"></div>
      </div>
    }
  `
})
class SampleLibComponent {
  show: InputSignal<boolean> = input();
  showContentWrapper: InputSignal<boolean> = input();
}

@Component({
  imports: [NgScrollbarModule, SampleLibComponent],
  template: `
    <ng-scrollbar [externalViewport]="externalViewport"
                  [externalContentWrapper]="externalContentWrapper"
                  [externalSpacer]="externalSpacer"
                  [asyncViewport]="asyncDetection"
                  (afterInit)="onInit()">
      <sample-lib [show]="showLib" [showContentWrapper]="showContentWrapper"/>
    </ng-scrollbar>
  `
})
class TestComponent {
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;
  asyncDetection: '' | 'auto';

  showLib: boolean;
  showContentWrapper: boolean = true;

  onInit() {
    console.log('🐨')
  }
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

  it('[externalViewport] [externalContentWrapper]', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    fixture.detectChanges();

    expect(scrollbarCmp.skipInit).toBeTrue();
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showLib = true;
    fixture.detectChanges();
    await fixture.whenStable();
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();
  });


  it('[externalViewport] [externalContentWrapper] [externalSpacer]', fakeAsync(async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    fixture.detectChanges();

    expect(scrollbarCmp.skipInit).toBeTrue();
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showLib = true;
    fixture.detectChanges();
    await fixture.whenStable();
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();
  }));

  it('[asyncDetection="auto"] should detect content removal', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    component.asyncDetection = 'auto';
    fixture.detectChanges();

    expect(scrollbarCmp.skipInit).toBeTrue();
    expect(scrollbarCmp.viewportRef).toBeUndefined();
    component.showLib = true;
    fixture.detectChanges();
    await fixture.whenStable();
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(scrollbarCmp.viewportRef).toBeDefined();

    // Mock library removes the content (such as dropdown)
    component.showLib = false;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(scrollbarCmp.viewportRef).toBeNull();
  });
});
