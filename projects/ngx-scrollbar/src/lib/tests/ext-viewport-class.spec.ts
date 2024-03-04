import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { NgScrollbarExt, NgScrollbarModule, } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { Scrollbars } from '../scrollbars/scrollbars';

@Component({
  standalone: true,
  selector: 'sample-content',
  template: `
    <div class="some-wrapper">
      <div class="my-custom-viewport">
        <div class="my-custom-content-wrapper">
          <div #sample class="content-sample">Content Sample</div>
        </div>
        <div class="my-custom-spacer"></div>
      </div>
    </div>
  `
})
class SampleContentComponent {
  @ViewChild('sample') content: ElementRef<HTMLElement>;
}

@Component({
  standalone: true,
  selector: 'sample-without-content-wrapper',
  template: `
    <div class="my-custom-viewport">
      <div #sample class="content-sample">Content Sample</div>
    </div>
  `
})
class SampleWithoutContentWrapperComponent {
  @ViewChild('sample') content: ElementRef<HTMLElement>;
}

@Component({
  standalone: true,
  imports: [NgScrollbarModule, SampleContentComponent, SampleWithoutContentWrapperComponent],
  template: `
    @if (withContentWrapper) {
      <ng-scrollbar [externalViewport]="externalViewport"
                    [externalContentWrapper]="externalContentWrapper"
                    [externalSpacer]="externalSpacer">
        <sample-content/>
      </ng-scrollbar>
    } @else {
      <ng-scrollbar [externalViewport]="externalViewport">
        <sample-without-content-wrapper/>
      </ng-scrollbar>
    }
  `
})
class ViewportClassExampleComponent {
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;

  withContentWrapper: boolean;

  @ViewChild(NgScrollbarExt) scrollbar: NgScrollbarExt;
  @ViewChild(SampleContentComponent) sample2: SampleContentComponent;
  @ViewChild(SampleWithoutContentWrapperComponent) sample1: SampleWithoutContentWrapperComponent;
}

describe('External viewport via classes', () => {
  let fixture: ComponentFixture<ViewportClassExampleComponent>;
  let component: ViewportClassExampleComponent;
  let scrollbar: NgScrollbarExt;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportClassExampleComponent);
    component = fixture.componentInstance;
  });

  it('[Viewport class] should initialize viewport and attach scrollbars', async () => {
    component.externalViewport = '.my-custom-viewport';
    fixture.detectChanges();

    scrollbar = component.scrollbar;

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeFalsy();
    expect(scrollbar.externalViewport).toBeTruthy();
    expect(scrollbar.externalContentWrapper).toBeFalsy();
    expect(scrollbar.externalSpacer).toBeFalsy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeTruthy();

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalViewport))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      viewportElement,
      viewportElement.firstElementChild as HTMLElement,
      undefined
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();

    await firstValueFrom(scrollbar.afterInit);

    // Verify the viewport
    expect(scrollbar.viewport.nativeElement).toBe(viewportElement);
    // // Verify that the content is a direct child of the content wrapper element
    expect(scrollbar.viewport.contentWrapperElement).toEqual(component.sample1.content.nativeElement.parentElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);
  });


  it('[Viewport + content wrapper classes] should initialize viewport and attach scrollbars', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.withContentWrapper = true;
    fixture.detectChanges();

    scrollbar = component.scrollbar;

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeFalsy();
    expect(scrollbar.externalViewport).toBeTruthy();
    expect(scrollbar.externalContentWrapper).toBeTruthy();
    expect(scrollbar.externalSpacer).toBeFalsy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeTruthy();

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalViewport))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      viewportElement,
      contentWrapperElement,
      undefined
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();

    await firstValueFrom(scrollbar.afterInit);

    // Verify the viewport
    expect(scrollbar.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper
    expect(scrollbar.viewport.contentWrapperElement).toBe(contentWrapperElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.sample2.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);
  });


  it('[Viewport + content wrapper + spacer classes] should initialize viewport and attach scrollbars', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    component.withContentWrapper = true;
    fixture.detectChanges();

    scrollbar = component.scrollbar;

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeFalsy();
    expect(scrollbar.externalViewport).toBeTruthy();
    expect(scrollbar.externalContentWrapper).toBeTruthy();
    expect(scrollbar.externalSpacer).toBeTruthy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeTruthy();

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalViewport))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper))?.nativeElement;
    const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalSpacer))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      viewportElement,
      contentWrapperElement,
      spacerElement
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();

    await firstValueFrom(scrollbar.afterInit);

    // Verify the viewport
    expect(scrollbar.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper to be the spacer element
    expect(scrollbar.viewport.contentWrapperElement).toBe(spacerElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.sample2.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);
  });

  it(`[Error handling - content wrapper doesn't exist] should NOT initialize viewport or attach scrollbars`, async () => {
    component.externalViewport = '.not-existing-viewport';
    fixture.detectChanges();
    scrollbar = component.scrollbar;

    const consoleSpy: jasmine.Spy = spyOn(console, 'error');
    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeFalsy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeFalsy();
    expect(scrollbar._scrollbars).toBeFalsy();
    expect(viewportInitSpy).not.toHaveBeenCalled();
    expect(attachScrollbarSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Could not find the viewport element for the provided selector "${ scrollbar.externalViewport }"`)
  });

  it(`[Error handling - content wrapper doesn't exist] should NOT initialize viewport or attach scrollbars`, async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.not-existing-content-wrapper';
    component.withContentWrapper = true;
    fixture.detectChanges();
    scrollbar = component.scrollbar;

    const consoleSpy: jasmine.Spy = spyOn(console, 'error');
    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeFalsy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeFalsy();
    expect(scrollbar._scrollbars).toBeFalsy();
    expect(viewportInitSpy).not.toHaveBeenCalled();
    expect(attachScrollbarSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Content wrapper element not found for the provided selector "${ scrollbar.externalContentWrapper }"`)
  });


  it(`[Error handling - spacer doesn't exist] should NOT initialize viewport or attach scrollbars`, async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.not-existing-spacer';
    component.withContentWrapper = true;
    fixture.detectChanges();
    scrollbar = component.scrollbar;

    const consoleSpy: jasmine.Spy = spyOn(console, 'error');
    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeFalsy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeFalsy();
    expect(scrollbar._scrollbars).toBeFalsy();
    expect(viewportInitSpy).not.toHaveBeenCalled();
    expect(attachScrollbarSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Spacer element not found for the provided selector "${ scrollbar.externalSpacer }"`)
  });
});
