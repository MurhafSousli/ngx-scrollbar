import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { Scrollbars } from '../scrollbars/scrollbars';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [NgScrollbarModule],
  template: `
    @if (withContentWrapper) {
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
    } @else {
      <ng-scrollbar externalViewport>
        <div scrollViewport>
          <div #sample class="content-sample">Content Sample</div>
        </div>
      </ng-scrollbar>
    }

  `
})
class ViewportDirectiveExampleComponent {
  externalContentWrapper: string;
  externalSpacer: string;
  withContentWrapper: boolean;

  @ViewChild(NgScrollbarExt) scrollbar: NgScrollbarExt;
  @ViewChild('sample') content: ElementRef<HTMLElement>;
}


describe('External viewport via scrollViewportDirective', () => {
  let fixture: ComponentFixture<ViewportDirectiveExampleComponent>;
  let component: ViewportDirectiveExampleComponent;
  let scrollbar: NgScrollbarExt;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportDirectiveExampleComponent);
    component = fixture.componentInstance;
  });

  it('[Via scrollViewport directive] should initialize viewport and attach scrollbars', async () => {
    fixture.detectChanges();

    scrollbar = component.scrollbar;

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeTruthy();
    expect(scrollbar.externalViewport).toBeFalsy();
    expect(scrollbar.externalContentWrapper).toBeFalsy();
    expect(scrollbar.externalSpacer).toBeFalsy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeTruthy();

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      scrollbar.customViewport.nativeElement,
      scrollbar.customViewport.nativeElement.firstElementChild as HTMLElement,
      undefined
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(component.scrollbar._scrollbarsRef).toBeTruthy();

    await firstValueFrom(scrollbar.afterInit);

    // Verify the viewport to be the scrollViewport directive
    expect(scrollbar.viewport.nativeElement).toBe(scrollbar.customViewport.nativeElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.content.nativeElement.parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbar._scrollbarsRef.hostView, 'destroy');
    scrollbar.ngOnDestroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });

  it('[Via scrollViewport directive + content wrapper classes] should initialize viewport and attach scrollbars', async () => {
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.withContentWrapper = true;
    fixture.detectChanges();

    scrollbar = component.scrollbar;

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeTruthy();
    expect(scrollbar.externalViewport).toBeFalsy();
    expect(scrollbar.externalContentWrapper).toBeTruthy();
    expect(scrollbar.externalSpacer).toBeFalsy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeTruthy();

    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      scrollbar.customViewport.nativeElement,
      contentWrapperElement,
      undefined
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(component.scrollbar._scrollbarsRef).toBeTruthy();

    await firstValueFrom(scrollbar.afterInit);

    // Verify the viewport to be the scrollViewport directive
    expect(scrollbar.viewport.nativeElement).toBe(scrollbar.customViewport.nativeElement);
    // Verify that the content wrapper
    expect(scrollbar.viewport.contentWrapperElement).toBe(contentWrapperElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbar._scrollbarsRef.hostView, 'destroy');
    scrollbar.ngOnDestroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });


  it('[Via scrollViewport Directive + content wrapper classes + spacer classes] should initialize viewport and attach scrollbars', async () => {
    component.externalContentWrapper = '.my-custom-content-wrapper';
    component.externalSpacer = '.my-custom-spacer';
    component.withContentWrapper = true;
    fixture.detectChanges();

    scrollbar = component.scrollbar;

    const viewportInitSpy: jasmine.Spy = spyOn(scrollbar.viewport, 'init');
    const attachScrollbarSpy: jasmine.Spy = spyOn(scrollbar, 'attachScrollbars');

    scrollbar.ngOnInit();
    scrollbar.ngAfterViewInit();
    expect(component.scrollbar._scrollbarsRef).toBeTruthy();

    fixture.detectChanges();

    expect(scrollbar.customViewport).toBeTruthy();
    expect(scrollbar.externalViewport).toBeFalsy();
    expect(scrollbar.externalContentWrapper).toBeTruthy();
    expect(scrollbar.externalSpacer).toBeTruthy();
    expect(scrollbar.skipInit).toBeFalsy();
    expect(scrollbar.viewport.initialized()).toBeTruthy();

    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalContentWrapper))?.nativeElement;
    const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbar.externalSpacer))?.nativeElement;

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(
      scrollbar.customViewport.nativeElement,
      contentWrapperElement,
      spacerElement
    );
    expect(attachScrollbarSpy).toHaveBeenCalled();
    expect(component.scrollbar._scrollbarsRef).toBeTruthy();

    await firstValueFrom(scrollbar.afterInit);

    // Verify the viewport to be the scrollViewport directive
    expect(scrollbar.viewport.nativeElement).toBe(scrollbar.customViewport.nativeElement);
    // Verify that the content wrapper to be the spacer element
    expect(scrollbar.viewport.contentWrapperElement).toBe(spacerElement);
    // Verify that the content is a direct child of the content wrapper element
    expect(component.content.nativeElement.parentElement).toBe(contentWrapperElement);

    // Check if the scrollbars component is created
    expect(scrollbar._scrollbars).toBeTruthy();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(scrollbar._scrollbars).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is the direct child of content wrapper element
    expect((scrollbarsDebugElement.nativeElement as Element).parentElement).toBe(scrollbar.viewport.contentWrapperElement);

    const hostViewDestroySpy: jasmine.Spy = spyOn(scrollbar._scrollbarsRef.hostView, 'destroy');
    scrollbar.ngOnDestroy();
    expect(hostViewDestroySpy).toHaveBeenCalled();
  });

});
