import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, input, InputSignal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { Scrollbars } from '../scrollbars/scrollbars';
import { ScrollViewport, ViewportAdapter } from '../viewport';

@Component({
  selector: 'sample-content',
  template: `
    <div class="my-custom-viewport">
      @if (viewportOnly()) {
        <div class="content-sample">Content Sample</div>
      }
      @if (viewportAndContentWrapper() || viewportAndContentWrapperAndSpacer()) {
        <div class="my-custom-content-wrapper">
          <div class="content-sample">Content Sample</div>
        </div>
        @if (viewportAndContentWrapperAndSpacer()) {
          <div class="my-custom-spacer"></div>
        }
      }
    </div>
  `
})
class SampleContentComponent {
  viewportOnly: InputSignal<boolean> = input();
  viewportAndContentWrapper: InputSignal<boolean> = input();
  viewportAndContentWrapperAndSpacer: InputSignal<boolean> = input();
}

@Component({
  imports: [NgScrollbarModule, SampleContentComponent],
  template: `
    <ng-scrollbar [externalViewport]="externalViewport"
                  [externalContentWrapper]="externalContentWrapper"
                  [externalSpacer]="externalSpacer">
      <sample-content [viewportOnly]="viewportOnly"
                      [viewportAndContentWrapper]="viewportAndContentWrapper"
                      [viewportAndContentWrapperAndSpacer]="viewportAndContentWrapperAndSpacer"/>
    </ng-scrollbar>
  `
})
class TestComponent {
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;
  viewportOnly: boolean;
  viewportAndContentWrapper: boolean;
  viewportAndContentWrapperAndSpacer: boolean;
}

describe('<ng-scrollbar externalViewport>', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let scrollbarCmp: NgScrollbarExt;
  let adapter: ViewportAdapter;
  let viewportComponent: ScrollViewport;
  let viewportElement: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    const scrollbarFixture: DebugElement = fixture.debugElement.query(By.directive(NgScrollbarExt));
    scrollbarCmp = scrollbarFixture.componentInstance;
    adapter = scrollbarFixture.injector.get(ViewportAdapter);
  });

  function verifyElements(scrollbarHost: HTMLElement): void {
    const viewportFixture: DebugElement = fixture.debugElement.query(By.directive(ScrollViewport));
    viewportComponent = viewportFixture.componentInstance;

    expect(scrollbarCmp.skipInit).toBeFalse();

    expect(adapter.initialized()).toBeTrue();
    // Verify the viewport
    expect(adapter.nativeElement).toBe(viewportElement);
    // Check if the scrollbars component is created
    expect(viewportComponent.scrollbarsRef).toBeDefined();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(viewportComponent.scrollbarsRef.instance).toBe(scrollbarsDebugElement.componentInstance);
    // Verify that the content wrapper here is the scrollbar host element
    expect(adapter.contentWrapperElement).toBe(scrollbarHost);
    // Check if the created scrollbars component is attached to the scrollbar host element
    expect(scrollbarsDebugElement.nativeElement.parentElement).toBe(viewportElement);
    // Verify that the content is a direct child of the content wrapper element
    const contentSample: DebugElement = fixture.debugElement.query(By.css('.content-sample'));
    expect(viewportComponent.contentWrapperElement).toBe(contentSample.nativeElement.parentElement);
  }

  function verifyDestroyed(): void {
    const contentDestroySpy: jasmine.Spy = spyOn(viewportComponent.contentWrapperRef.hostView, 'destroy');
    const scrollbarsDestroySpy: jasmine.Spy = spyOn(viewportComponent.scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(contentDestroySpy).toHaveBeenCalled();
    expect(scrollbarsDestroySpy).toHaveBeenCalled();
  }

  it('[externalViewport]', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.viewportOnly = true;
    fixture.detectChanges();

    expect(scrollbarCmp.viewportElement()).toBeDefined();
    expect(scrollbarCmp.contentWrapperElement()).toBeNull();
    expect(scrollbarCmp.spacerElement()).toBeNull();

    await firstValueFrom(outputToObservable(adapter.afterInit));

    viewportElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;

    verifyElements(viewportElement.firstElementChild as HTMLElement);
    verifyDestroyed();
  });

  it('[externalViewport] [externalContentWrapper]', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.viewportAndContentWrapper = true;
    fixture.detectChanges();

    expect(scrollbarCmp.viewportElement()).toBeDefined();
    expect(scrollbarCmp.contentWrapperElement()).toBeDefined();
    expect(scrollbarCmp.spacerElement()).toBeNull();

    await firstValueFrom(outputToObservable(adapter.afterInit));

    viewportElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;

    verifyElements(contentWrapperElement);
    verifyDestroyed();
  });

  it('[externalViewport] [externalContentWrapper] [externalSpacer]', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    component.viewportAndContentWrapperAndSpacer = true;
    fixture.detectChanges();

    expect(scrollbarCmp.viewportElement()).toBeDefined();
    expect(scrollbarCmp.contentWrapperElement()).toBeDefined();
    expect(scrollbarCmp.spacerElement()).toBeDefined();

    await firstValueFrom(outputToObservable(adapter.afterInit));

    viewportElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
    const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalSpacer()))?.nativeElement;

    verifyElements(spacerElement);
    verifyDestroyed();
  });

  it('should log error if viewport does not exist', () => {
    component.externalViewport = '.non-existing';
    component.viewportAndContentWrapperAndSpacer = true;
    const consoleSpy: jasmine.Spy = spyOn(console, 'error');
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Could not find the viewport element for the provided selector "${ scrollbarCmp.externalViewport() }"`);
  });

  it('should log error if content wrapper does not exist', () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.non-existing';
    component.viewportAndContentWrapperAndSpacer = true;
    const consoleSpy: jasmine.Spy = spyOn(console, 'error');
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Content wrapper element not found for the provided selector "${ scrollbarCmp.externalContentWrapper() }"`);
  });

  it('should log error if spacer does not exist', () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.non-existing';
    component.viewportAndContentWrapperAndSpacer = true;
    const consoleSpy: jasmine.Spy = spyOn(console, 'error');
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Spacer element not found for the provided selector "${ scrollbarCmp.externalSpacer() }"`);
  });
});
