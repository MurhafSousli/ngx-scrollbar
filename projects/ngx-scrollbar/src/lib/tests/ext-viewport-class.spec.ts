import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, ElementRef, Signal, viewChild, ViewChild } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
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
    imports: [NgScrollbarModule, SampleContentComponent, SampleWithoutContentWrapperComponent],
    template: `
    <ng-scrollbar [externalViewport]="externalViewport">
      <sample-without-content-wrapper/>
    </ng-scrollbar>
  `
})
class WithViewportDirectiveComponent {
  externalViewport: string;
  scrollbar: Signal<NgScrollbarExt> = viewChild(NgScrollbarExt);
  sample1: Signal<SampleWithoutContentWrapperComponent> = viewChild(SampleWithoutContentWrapperComponent);
}

@Component({
    imports: [NgScrollbarModule, SampleContentComponent, SampleWithoutContentWrapperComponent],
    template: `
    <ng-scrollbar [externalViewport]="externalViewport"
                  [externalContentWrapper]="externalContentWrapper"
                  [externalSpacer]="externalSpacer">
      <sample-content/>
    </ng-scrollbar>
  `
})
class WithViewportDirectiveAndInputsComponent {
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;
  scrollbar: Signal<NgScrollbarExt> = viewChild(NgScrollbarExt);
  sample2: Signal<SampleContentComponent> = viewChild(SampleContentComponent);
}

describe('External viewport via classes', () => {

  it('[Viewport class] should initialize viewport and attach scrollbars', async () => {
    const fixture: ComponentFixture<WithViewportDirectiveComponent> = TestBed.createComponent(WithViewportDirectiveComponent);
    const component: WithViewportDirectiveComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, '_attachScrollbars').and.callThrough();
    component.externalViewport = '.my-custom-viewport';

    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeFalsy();
    expect(scrollbarCmp.externalViewport()).toBeTruthy();
    expect(scrollbarCmp.externalContentWrapper()).toBeFalsy();
    expect(scrollbarCmp.externalSpacer()).toBeFalsy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeTruthy();

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      viewportElement,
      viewportElement.firstElementChild as HTMLElement,
      null
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(scrollbarCmp._scrollbarsRef).toBeTruthy();

    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));

    // Verify the viewport
    expect(scrollbarCmp.viewport.nativeElement).toBe(viewportElement);
    // // Verify that the content is a direct child of the content wrapper element
    expect(scrollbarCmp.viewport.contentWrapperElement).toEqual(component.sample1().content.nativeElement.parentElement);

    // Check if the scrollbars component is created
    expect(scrollbarCmp._scrollbars()).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbarCmp._scrollbars()).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbarCmp.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbarCmp._scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });


  it('[Viewport + content wrapper classes] should initialize viewport and attach scrollbars', async () => {
    const fixture: ComponentFixture<WithViewportDirectiveAndInputsComponent> = TestBed.createComponent(WithViewportDirectiveAndInputsComponent);
    const component: WithViewportDirectiveAndInputsComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, '_attachScrollbars').and.callThrough();
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';


    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeFalsy();
    expect(scrollbarCmp.externalViewport()).toBeTruthy();
    expect(scrollbarCmp.externalContentWrapper()).toBeTruthy();
    expect(scrollbarCmp.externalSpacer()).toBeFalsy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeTruthy();

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      viewportElement,
      contentWrapperElement,
      null
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(scrollbarCmp._scrollbarsRef).toBeTruthy();

    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));

    // Verify the viewport
    expect(scrollbarCmp.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper
    expect(scrollbarCmp.viewport.contentWrapperElement).toBe(contentWrapperElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.sample2().content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbarCmp._scrollbars()).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbarCmp._scrollbars()).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbarCmp.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbarCmp._scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });

  it('[Viewport + content wrapper + spacer classes] should initialize viewport and attach scrollbars', async () => {
    const fixture: ComponentFixture<WithViewportDirectiveAndInputsComponent> = TestBed.createComponent(WithViewportDirectiveAndInputsComponent);
    const component: WithViewportDirectiveAndInputsComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, '_attachScrollbars').and.callThrough();
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';


    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeFalsy();
    expect(scrollbarCmp.externalViewport()).toBeTruthy();
    expect(scrollbarCmp.externalContentWrapper()).toBeTruthy();
    expect(scrollbarCmp.externalSpacer()).toBeTruthy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeTruthy();

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;
    const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalSpacer()))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      viewportElement,
      contentWrapperElement,
      spacerElement
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(scrollbarCmp._scrollbarsRef).toBeTruthy();

    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));

    // Verify the viewport
    expect(scrollbarCmp.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper to be the spacer element
    expect(scrollbarCmp.viewport.contentWrapperElement).toBe(spacerElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.sample2().content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbarCmp._scrollbars()).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbarCmp._scrollbars()).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbarCmp.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbarCmp._scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });

  it(`[Error handling - viewport doesn't exist] should NOT initialize viewport or attach scrollbars`, async () => {
    const fixture: ComponentFixture<WithViewportDirectiveAndInputsComponent> = TestBed.createComponent(WithViewportDirectiveAndInputsComponent);
    const component: WithViewportDirectiveAndInputsComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, '_attachScrollbars').and.callThrough();
    const consoleSpy: jasmine.Spy = spyOn(console, 'error').and.callThrough();

    component.externalViewport = null;

    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeFalsy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeFalsy();
    expect(scrollbarCmp._scrollbars()).toBeFalsy();
    expect(viewportInitSpy).not.toHaveBeenCalled();
    expect(attachScrollbarSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Could not find the viewport element for the provided selector "${ scrollbarCmp.externalViewport() }"`)
  });

  it(`[Error handling - content wrapper doesn't exist] should NOT initialize viewport or attach scrollbars`, async () => {
    const fixture: ComponentFixture<WithViewportDirectiveAndInputsComponent> = TestBed.createComponent(WithViewportDirectiveAndInputsComponent);
    const component: WithViewportDirectiveAndInputsComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, '_attachScrollbars').and.callThrough();
    const consoleSpy: jasmine.Spy = spyOn(console, 'error').and.callThrough();

    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.not-existing-content-wrapper';


    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeFalsy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeFalsy();
    expect(scrollbarCmp._scrollbars()).toBeFalsy();
    expect(viewportInitSpy).not.toHaveBeenCalled();
    expect(attachScrollbarSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Content wrapper element not found for the provided selector "${ scrollbarCmp.externalContentWrapper() }"`)
  });

  it(`[Error handling - spacer doesn't exist] should NOT initialize viewport or attach scrollbars`, async () => {
    const fixture: ComponentFixture<WithViewportDirectiveAndInputsComponent> = TestBed.createComponent(WithViewportDirectiveAndInputsComponent);
    const component: WithViewportDirectiveAndInputsComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, '_attachScrollbars').and.callThrough();
    const consoleSpy: jasmine.Spy = spyOn(console, 'error').and.callThrough();

    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.not-existing-spacer';


    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeFalsy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeFalsy();
    expect(scrollbarCmp._scrollbars()).toBeFalsy();
    expect(viewportInitSpy).not.toHaveBeenCalled();
    expect(attachScrollbarSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Spacer element not found for the provided selector "${ scrollbarCmp.externalSpacer() }"`)
  });
});
