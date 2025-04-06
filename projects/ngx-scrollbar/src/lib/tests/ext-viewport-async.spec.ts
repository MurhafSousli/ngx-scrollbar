import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, ElementRef, viewChild, Signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { Scrollbars } from '../scrollbars/scrollbars';
import { afterTimeout } from './common-test.';
import { ScrollViewport } from '../viewport';

@Component({
  selector: 'sample-lib',
  template: `
    @if (show) {
      <div class="some-wrapper">
        <div class="my-custom-viewport" style="background:green; width: 100px; height: 100px">
          @if (showWrapper) {
            <div class="my-custom-content-wrapper" style="width: 500px; height: 500px; background: red">
              <div #sample class="content-sample" style="width: 500px; height: 500px; background: red">Content Sample</div>
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
  content: Signal<ElementRef<HTMLElement>> = viewChild('sample');
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
  scrollbar: Signal<NgScrollbarExt> = viewChild(NgScrollbarExt);
  library: Signal<SampleLibComponent> = viewChild(SampleLibComponent);
}

describe('<ng-scrollbar externalViewport asyncDetection>', () => {
  let fixture: ComponentFixture<ViewportClassExampleComponent>;
  let component: ViewportClassExampleComponent;
  let scrollbarCmp: NgScrollbarExt;
  let viewportComponent: ScrollViewport;
  let viewportElement: HTMLElement;

  async function setupTest(viewport: string, contentWrapper?: string, spacer?: string, asyncDetection?: 'auto'): Promise<void> {
    component.externalViewport = viewport;
    if (contentWrapper) component.externalContentWrapper = contentWrapper;
    if (spacer) component.externalSpacer = spacer;
    if (asyncDetection) component.asyncDetection = asyncDetection;
    fixture.detectChanges();

    expect(scrollbarCmp.skipInit).toBeTrue();
    expect(scrollbarCmp.viewport.initialized()).toBeFalse();
    // Mock library render after the scrollbar has initialized
    component.library().show = true;
    fixture.detectChanges();

    await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));
    viewportComponent = scrollbarCmp.viewportRef.instance;
    viewportElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
  }

  function verifyExpectedElements(scrollbarHost: Element): void {
    expect(scrollbarCmp.viewport.initialized()).toBeTrue();
    // Verify the viewport
    expect(scrollbarCmp.viewport.nativeElement).toBe(viewportElement);
    // Check if the scrollbars component is created
    expect(viewportComponent.scrollbarsRef).toBeDefined();
    const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
    // Verify if the created scrollbars component is the same component instance queried
    expect(viewportComponent.scrollbarsRef.instance).toBe(scrollbarsDebugElement.componentInstance);
    // Check if the created scrollbars component is attached to the spacer element
    expect(scrollbarsDebugElement.nativeElement.parentElement).toBe(scrollbarHost);
  }

  function verifyDestroyed(): void {
    const contentDestroySpy: jasmine.Spy = spyOn(viewportComponent.actualContentRef.hostView, 'destroy');
    const scrollbarsDestroySpy: jasmine.Spy = spyOn(viewportComponent.scrollbarsRef.hostView, 'destroy');
    fixture.destroy();
    expect(contentDestroySpy).toHaveBeenCalled();
    expect(scrollbarsDestroySpy).toHaveBeenCalled();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportClassExampleComponent);
    fixture.autoDetectChanges(true);
    component = fixture.componentInstance;
    scrollbarCmp = component.scrollbar();
  });

  it('[externalViewport] [externalContentWrapper]', async () => {
    await setupTest('.my-custom-viewport', '.my-custom-content-wrapper');

    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;

    verifyExpectedElements(contentWrapperElement);
    verifyDestroyed();
  });


  it('[externalViewport] [externalContentWrapper] [externalSpacer]', async () => {
    await setupTest('.my-custom-viewport', '.my-custom-content-wrapper', '.my-custom-spacer');

    const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalSpacer()))?.nativeElement;

    verifyExpectedElements(spacerElement);
    verifyDestroyed();
  });

  it('[asyncDetection="auto"] should detect content removal', async () => {
    await setupTest('.my-custom-viewport', '.my-custom-content-wrapper', undefined, 'auto');

    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;

    verifyExpectedElements(contentWrapperElement);

    // MutationObserver has a throttleTime 100ms, need to wait before triggering a detection
    await afterTimeout(100);
    // Mock library removes the content (such as dropdown)
    component.library().show = false;
    fixture.detectChanges();
    // Wait a bit more than 100ms for change to take effect
    await afterTimeout(110);

    expect(scrollbarCmp.viewport.initialized()).toBeFalse();
    expect(scrollbarCmp.viewport.nativeElement).toBeNull();
    expect(scrollbarCmp.viewport.contentWrapperElement).toBeNull();

    verifyDestroyed();
  });

  xit('[asyncDetection="auto"] should detect content wrapper removal', async () => {
    await setupTest('.my-custom-viewport', '.my-custom-content-wrapper', undefined, 'auto');

    const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;

    verifyExpectedElements(contentWrapperElement);

    // TODO: The problem here that the content is not rendering as child of content wrapper,
    //  therefore the mutation observer of async detection is also not detecting the removal of the content
    // MutationObserver has a throttleTime 100ms, need to wait before triggering a detection
    await afterTimeout(100);
    // Mock library removes the content (such as dropdown)
    component.library().showWrapper = false;
    fixture.detectChanges();
    // Wait a bit more than 100ms for change to take effect
    await afterTimeout(110);

    expect(scrollbarCmp.viewport.initialized()).toBeTrue();
    expect(scrollbarCmp.viewport.nativeElement).toBeDefined();
    expect(scrollbarCmp.viewport.contentWrapperElement).toBeNull();

    // verifyDestroyed();
  });
});
