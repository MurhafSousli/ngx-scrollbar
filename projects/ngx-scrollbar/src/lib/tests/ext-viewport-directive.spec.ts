import { Component, DebugElement, ElementRef, Signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { Scrollbars } from '../scrollbars/scrollbars';

@Component({
  standalone: true,
  imports: [NgScrollbarModule],
  template: `
    <ng-scrollbar externalViewport>
      <div scrollViewport>
        <div #sample class="content-sample">Content Sample</div>
      </div>
    </ng-scrollbar>
  `
})
class WithViewportDirectiveComponent {
  scrollbar: Signal<NgScrollbarExt> = viewChild(NgScrollbarExt);
  content: Signal<ElementRef<HTMLElement>> = viewChild('sample');
}

@Component({
  standalone: true,
  imports: [NgScrollbarModule],
  template: `
    <ng-scrollbar externalViewport
                  [externalContentWrapper]="externalContentWrapper"
                  [externalSpacer]="externalSpacer">
      <div scrollViewport>
        <div class="my-custom-content-wrapper">
          <div #sample class="content-sample">Content Sample</div>
        </div>
        <div class="my-custom-spacer"></div>
      </div>
    </ng-scrollbar>
  `
})
class WithViewportDirectiveAndInputsComponent {
  externalContentWrapper: string;
  externalSpacer: string;
  scrollbar: Signal<NgScrollbarExt> = viewChild(NgScrollbarExt);
  content: Signal<ElementRef<HTMLElement>> = viewChild('sample');
}

describe('External viewport via scrollViewportDirective', () => {

  it('[Via scrollViewport directive] should initialize viewport and attach scrollbars', async () => {
    const fixture: ComponentFixture<WithViewportDirectiveComponent> = TestBed.createComponent(WithViewportDirectiveComponent);
    const component: WithViewportDirectiveComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, 'attachScrollbars').and.callThrough();

    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeTruthy();
    expect(scrollbarCmp.externalViewport()).toBeFalsy();
    expect(scrollbarCmp.externalContentWrapper()).toBeFalsy();
    expect(scrollbarCmp.externalSpacer()).toBeFalsy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeTruthy();

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      scrollbarCmp.customViewport().nativeElement,
      scrollbarCmp.customViewport().nativeElement.firstElementChild,
      null
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(scrollbarCmp._scrollbarsRef).toBeTruthy();

    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));

    // Verify the viewport to be the scrollViewport directive
    expect(scrollbarCmp.viewport.nativeElement).toBe(scrollbarCmp.customViewport().nativeElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.content().nativeElement.parentElement).toBe(scrollbarCmp.viewport.contentWrapperElement);

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

  it('[Via scrollViewport directive + content wrapper classes] should initialize viewport and attach scrollbars', async () => {
    const fixture: ComponentFixture<WithViewportDirectiveAndInputsComponent> = TestBed.createComponent(WithViewportDirectiveAndInputsComponent);
    const component: WithViewportDirectiveAndInputsComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, 'attachScrollbars').and.callThrough();
    component.externalContentWrapper = '.my-custom-content-wrapper';

    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeTruthy();
    expect(scrollbarCmp.externalViewport()).toBeFalsy();
    expect(scrollbarCmp.externalContentWrapper()).toBeTruthy();
    expect(scrollbarCmp.externalSpacer()).toBeFalsy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeTruthy();

    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      scrollbarCmp.customViewport().nativeElement,
      contentWrapperElement,
      null
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(scrollbarCmp._scrollbarsRef).toBeTruthy();

    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));

    // Verify the viewport to be the scrollViewport directive
    expect(scrollbarCmp.viewport.nativeElement).toBe(scrollbarCmp.customViewport().nativeElement);
    // Verify that the content wrapper
    expect(scrollbarCmp.viewport.contentWrapperElement).toBe(contentWrapperElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.content().nativeElement.parentElement).toBe(contentWrapperElement);

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


  it('[Via scrollViewport Directive + content wrapper classes + spacer classes] should initialize viewport and attach scrollbars', async () => {
    const fixture: ComponentFixture<WithViewportDirectiveAndInputsComponent> = TestBed.createComponent(WithViewportDirectiveAndInputsComponent);
    const component: WithViewportDirectiveAndInputsComponent = fixture.componentInstance;
    const scrollbarCmp: NgScrollbarExt = component.scrollbar();

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbarCmp.viewport, 'init').and.callThrough();
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbarCmp, 'attachScrollbars').and.callThrough();

    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';

    fixture.detectChanges();

    expect(scrollbarCmp.customViewport()).toBeTruthy();
    expect(scrollbarCmp.externalViewport()).toBeFalsy();
    expect(scrollbarCmp.externalContentWrapper()).toBeTruthy();
    expect(scrollbarCmp.externalSpacer()).toBeTruthy();
    expect(scrollbarCmp.skipInit).toBeFalsy();
    expect(scrollbarCmp.viewport.initialized()).toBeTruthy();

    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;
    const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalSpacer()))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      scrollbarCmp.customViewport().nativeElement,
      contentWrapperElement,
      spacerElement
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(scrollbarCmp._scrollbarsRef).toBeTruthy();

    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));

    // Verify the viewport to be the scrollViewport directive
    expect(scrollbarCmp.viewport.nativeElement).toBe(scrollbarCmp.customViewport().nativeElement);
    // Verify that the content wrapper to be the spacer element
    expect(scrollbarCmp.viewport.contentWrapperElement).toBe(spacerElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.content().nativeElement.parentElement).toBe(contentWrapperElement);

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

});
