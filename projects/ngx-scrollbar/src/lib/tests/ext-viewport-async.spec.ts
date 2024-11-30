import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, ViewChild, DebugElement, ElementRef } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { Scrollbars } from '../scrollbars/scrollbars';
import { afterTimeout } from './common-test.';

@Component({
  standalone: true,
  selector: 'sample-lib',
  template: `
    @if (show) {
      <div class="some-wrapper">
        <div class="my-custom-viewport">
          @if (showWrapper) {
            <div class="my-custom-content-wrapper">
              <div #sample class="content-sample">Content Sample</div>
            </div>
          }
          <div class="my-custom-spacer"></div>
        </div>
      </div>
    }
  `
})
class SampleLibComponent {
  show: boolean;
  showWrapper: boolean = true;
  @ViewChild('sample') content: ElementRef<HTMLElement>;
}

@Component({
    imports: [NgScrollbarModule, SampleLibComponent],
    template: `
    <ng-scrollbar [externalViewport]="externalViewport"
                  [externalContentWrapper]="externalContentWrapper"
                  [externalSpacer]="externalSpacer"
                  [asyncDetection]="asyncDetection">
      <sample-lib/>
    </ng-scrollbar>
  `
})
class ViewportClassExampleComponent {
  externalViewport: string;
  externalContentWrapper: string;
  externalSpacer: string;
  asyncDetection: '' | 'auto';
  @ViewChild(NgScrollbarExt, { static: true }) scrollbar: NgScrollbarExt;
  @ViewChild(SampleLibComponent, { static: true }) library: SampleLibComponent;
}

describe('External viewport via classes [AsyncDetection]', () => {
  let fixture: ComponentFixture<ViewportClassExampleComponent>;
  let component: ViewportClassExampleComponent;
  let scrollbar: NgScrollbarExt;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportClassExampleComponent);
    component = fixture.componentInstance;
    scrollbar = component.scrollbar;
  });

  it('[Viewport + content wrapper classes] should initialize viewport and attach scrollbars', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    fixture.detectChanges();

    expect(scrollbar.customViewport()).toBeFalsy();
    expect(scrollbar.externalViewport()).toBeTruthy();
    expect(scrollbar.externalContentWrapper()).toBeTruthy();
    expect(scrollbar.externalSpacer()).toBeFalsy();
    expect(scrollbar.skipInit).toBeTruthy();
    expect(scrollbar.viewport.initialized()).toBeFalsy();

    // Mock library render after the scrollbar has initialized
    component.library.show = true;
    fixture.detectChanges();

    // Verify afterInit is called
    await firstValueFrom(outputToObservable(scrollbar.afterInit));

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalViewport()))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper()))?.nativeElement;

    // Verify the viewport
    expect(scrollbar.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper here is the content wrapper element
    expect(scrollbar.viewport.contentWrapperElement).toBe(contentWrapperElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.library.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars()).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars()).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbar._scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });


  it('[Viewport + content wrapper + spacer classes] should initialize viewport and attach scrollbars', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    fixture.detectChanges();

    expect(scrollbar.customViewport()).toBeFalsy();
    expect(scrollbar.externalViewport()).toBeTruthy();
    expect(scrollbar.externalContentWrapper()).toBeTruthy();
    expect(scrollbar.externalSpacer()).toBeTruthy();
    expect(scrollbar.skipInit).toBeTruthy();
    expect(scrollbar.viewport.initialized()).toBeFalsy();

    // Mock library render after the scrollbar has initialized
    component.library.show = true;
    fixture.detectChanges();

    await firstValueFrom(outputToObservable(scrollbar.afterInit));

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalViewport()))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper()))?.nativeElement;
    const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalSpacer()))?.nativeElement;

    // Verify the viewport
    expect(scrollbar.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper here is the spacer element
    expect(scrollbar.viewport.contentWrapperElement).toBe(spacerElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.library.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars()).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars()).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbar._scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });

  it('[asyncDetection="auto"] should detect content removal', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.asyncDetection = 'auto';
    fixture.detectChanges();

    expect(scrollbar.customViewport()).toBeFalsy();
    expect(scrollbar.externalViewport()).toBeTruthy();
    expect(scrollbar.externalContentWrapper()).toBeTruthy();
    expect(scrollbar.externalSpacer()).toBeFalsy();
    expect(scrollbar.skipInit).toBeTruthy();
    expect(scrollbar.viewport.initialized()).toBeFalsy();

    // Mock library render after the scrollbar has initialized
    component.library.show = true;
    fixture.detectChanges();

    // Verify afterInit is called
    await firstValueFrom(outputToObservable(scrollbar.afterInit));

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalViewport()))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper()))?.nativeElement;

    // Verify the viewport
    expect(scrollbar.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper here is the content wrapper element
    expect(scrollbar.viewport.contentWrapperElement).toBe(contentWrapperElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.library.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars()).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars()).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    // MutationObserver has a throttleTime 100ms, need to wait before triggering a detection
    await afterTimeout(100);
    // Mock library removes the content (such as dropdown)
    component.library.show = false;
    fixture.detectChanges();
    // Wait a bit more than 100ms for change to take effect
    await afterTimeout(110);

    expect(scrollbar.viewport.initialized()).toBeFalse();
    expect(scrollbar.viewport.nativeElement).toBeFalsy();
    expect(scrollbar.viewport.contentWrapperElement).toBeFalsy();

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbar._scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });

  it('[asyncDetection="auto"] should detect content wrapper removal', async () => {
    component.externalViewport = '.my-custom-viewport';
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.asyncDetection = 'auto';
    fixture.detectChanges();

    expect(scrollbar.customViewport()).toBeFalsy();
    expect(scrollbar.externalViewport()).toBeTruthy();
    expect(scrollbar.externalContentWrapper()).toBeTruthy();
    expect(scrollbar.externalSpacer()).toBeFalsy();
    expect(scrollbar.skipInit).toBeTruthy();
    expect(scrollbar.viewport.initialized()).toBeFalsy();

    // Mock library render after the scrollbar has initialized
    component.library.show = true;
    fixture.detectChanges();

    // Verify afterInit is called
    await firstValueFrom(outputToObservable(scrollbar.afterInit));

    const viewportElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalViewport()))?.nativeElement;
    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper()))?.nativeElement;

    // Verify the viewport
    expect(scrollbar.viewport.nativeElement).toBe(viewportElement);
    // Verify that the content wrapper here is the content wrapper element
    expect(scrollbar.viewport.contentWrapperElement).toBe(contentWrapperElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.library.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars()).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars()).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    // MutationObserver has a throttleTime 100ms, need to wait before triggering a detection
    await afterTimeout(100);
    // Mock library removes the content (such as dropdown)
    component.library.showWrapper = false;
    fixture.detectChanges();
    // Wait a bit more than 100ms for change to take effect
    await afterTimeout(110);

    expect(scrollbar.viewport.initialized()).toBeFalse();
    expect(scrollbar.viewport.nativeElement).toBeFalsy();
    expect(scrollbar.viewport.contentWrapperElement).toBeFalsy();

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbar._scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });
});
