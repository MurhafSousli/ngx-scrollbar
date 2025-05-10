//
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { Component, DebugElement, NgZone } from '@angular/core';
// import { outputToObservable } from '@angular/core/rxjs-interop';
// import { NgScrollbarExt, NgScrollbarExtDirective, NgScrollbarModule } from 'ngx-scrollbar';
// import { firstValueFrom } from 'rxjs';
// import { ScrollViewport, ViewportAdapter } from './viewport';
//
// /**
//  * Use case 1: external viewport only
//  * Use case 2: external viewport and content wrapper
//  * Use case 3: external viewport and content wrapper and spacer
//  */
//
// @Component({
//   selector: 'sample-content',
//   template: `
//     <div class="some-wrapper">
//       <div class="my-custom-viewport">
//         <div class="my-custom-content-wrapper">
//           <div class="content-sample">Content Sample</div>
//         </div>
//         <div class="my-custom-spacer"></div>
//       </div>
//     </div>
//   `
// })
// class SampleContentComponent {
// }
//
// @Component({
//   imports: [NgScrollbarModule, SampleContentComponent, NgScrollbarExtDirective],
//   template: `
//     @if () {
//       <div class="ext-viewport"
//            ngScrollbar
//                     [externalContentWrapper]="externalContentWrapper"
//                     [externalSpacer]="externalSpacer">
//         <sample-content/>
//       </div>
//     }
//
//
//     <ng-scrollbar [externalViewport]="externalViewport"
//                   [externalContentWrapper]="externalContentWrapper"
//                   [externalSpacer]="externalSpacer">
//       <sample-content/>
//     </ng-scrollbar>
//   `
// })
// class WithViewportDirectiveAndInputsComponent {
//   externalViewport: string;
//   externalContentWrapper: string;
//   externalSpacer: string;
// }
//
// xdescribe('<ng-scrollbar externalViewport>', () => {
//   let fixture: ComponentFixture<any>;
//   let component: any;
//   let scrollbarCmp: NgScrollbarExt;
//   let viewportRef: ViewportAdapter;
//   let viewportComponent: ScrollViewport;
//   let viewportElement: HTMLElement;
//   let viewportInitSpy: jasmine.Spy;
//   let attachScrollbarSpy: jasmine.Spy;
//   let attachContentSpy: jasmine.Spy;
//   let consoleSpy: jasmine.Spy;
//
//   function spyOnInitFunctions(): void {
//     TestBed.inject(NgZone).run(() => {
//       fixture.detectChanges();
//       const viewportFixture: DebugElement = fixture.debugElement.query(By.directive(ScrollViewport));
//       viewportComponent = viewportFixture.componentInstance;
//       viewportRef = viewportFixture.injector.get(ViewportAdapter);
//       attachContentSpy = spyOn(viewportComponent, 'createContentWrapper').and.callThrough();
//       attachScrollbarSpy = spyOn(viewportComponent, 'attachScrollbars').and.callThrough();
//       viewportInitSpy = spyOn(viewportComponent.viewport, 'init').and.callThrough();
//       expect(viewportComponent.viewport).toBe(viewportRef);
//     });
//
//     expect(scrollbarCmp.skipInit).toBeFalse();
//     expect(viewportRef.initialized()).toBeTrue();
//   }
//
//   function spyOnError(): void {
//     viewportInitSpy = spyOn(viewportRef, 'init').and.callThrough();
//     consoleSpy = spyOn(console, 'error').and.callThrough();
//     fixture.detectChanges();
//   }
//
//   function setupTest(TestComponent: any, viewport: string, contentWrapper?: string, spacer?: string): void {
//     fixture = TestBed.createComponent(TestComponent);
//     component = fixture.componentInstance;
//     const scrollbarFixture: DebugElement = fixture.debugElement.query(By.directive(NgScrollbarExt));
//     scrollbarCmp = scrollbarFixture.componentInstance;
//
//     component.externalViewport = viewport;
//     if (contentWrapper) component.externalContentWrapper = contentWrapper;
//     if (spacer) component.externalSpacer = spacer;
//   }
//
//   function verifyExpectedElements(scrollbarHost: HTMLElement): void {
//     expect(viewportRef.initialized()).toBeTrue();
//     // Verify the viewport
//     expect(viewportRef.nativeElement).toBe(viewportElement);
//     // Check if the scrollbars component is created
//     expect(viewportComponent.scrollbarsRef).toBeDefined();
//     const scrollbarsDebugElement: DebugElement = fixture.debugElement.query(By.directive(Scrollbars));
//     // Verify if the created scrollbars component is the same component instance queried
//     expect(viewportComponent.scrollbarsRef.instance).toBe(scrollbarsDebugElement.componentInstance);
//     // Verify that the content wrapper here is the scrollbar host element
//     expect(viewportRef.contentWrapperElement).toBe(scrollbarHost);
//     // Check if the created scrollbars component is attached to the scrollbar host element
//     expect(scrollbarsDebugElement.nativeElement.parentElement).toBe(scrollbarHost);
//     // Verify that the content is a direct child of the content wrapper element
//     const contentSample: DebugElement = fixture.debugElement.query(By.css('.content-sample'));
//     expect(viewportComponent.actualContentElement).toBe(contentSample.nativeElement.parentElement);
//   }
//
//   function verifyDestroyed(): void {
//     const contentDestroySpy: jasmine.Spy = spyOn(viewportComponent.actualContentRef.hostView, 'destroy');
//     const scrollbarsDestroySpy: jasmine.Spy = spyOn(viewportComponent.scrollbarsRef.hostView, 'destroy');
//     fixture.destroy();
//     expect(contentDestroySpy).toHaveBeenCalled();
//     expect(scrollbarsDestroySpy).toHaveBeenCalled();
//   }
//
//   it('[externalViewport]', async () => {
//     setupTest(WithViewportDirectiveComponent, '.my-custom-viewport');
//     await spyOnInitFunctions();
//
//     expect(scrollbarCmp.externalViewport()).toBeDefined();
//     expect(scrollbarCmp.externalContentWrapper()).toBeUndefined();
//     expect(scrollbarCmp.externalSpacer()).toBeUndefined();
//
//     viewportElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
//
//     expect(viewportInitSpy).toHaveBeenCalledOnceWith(
//       viewportElement,
//       viewportElement.firstElementChild,
//       null
//     );
//     expect(attachContentSpy).toHaveBeenCalledWith(null);
//     expect(attachScrollbarSpy).toHaveBeenCalledWith(viewportElement.firstElementChild);
//     await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));
//
//     verifyExpectedElements(viewportElement.firstElementChild as HTMLElement);
//     verifyDestroyed();
//   });
//
//   it('[externalViewport] [externalContentWrapper]', async () => {
//     setupTest(WithViewportDirectiveAndInputsComponent, '.my-custom-viewport', '.my-custom-content-wrapper');
//     spyOnInitFunctions();
//
//     expect(scrollbarCmp.externalViewport()).toBeDefined();
//     expect(scrollbarCmp.externalContentWrapper()).toBeDefined();
//     expect(scrollbarCmp.externalSpacer()).toBeUndefined();
//
//     viewportElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
//     const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;
//
//     expect(viewportInitSpy).toHaveBeenCalledOnceWith(
//       viewportElement,
//       contentWrapperElement,
//       null
//     );
//     expect(attachContentSpy).toHaveBeenCalledWith(contentWrapperElement);
//     expect(attachScrollbarSpy).toHaveBeenCalledWith(contentWrapperElement);
//
//     await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));
//
//     verifyExpectedElements(contentWrapperElement);
//     verifyDestroyed();
//   });
//
//   it('[externalViewport] [externalContentWrapper] [externalSpacer]', async () => {
//     setupTest(WithViewportDirectiveAndInputsComponent, '.my-custom-viewport', '.my-custom-content-wrapper', '.my-custom-spacer');
//     spyOnInitFunctions();
//
//     expect(scrollbarCmp.externalViewport()).toBeDefined();
//     expect(scrollbarCmp.externalContentWrapper()).toBeDefined();
//     expect(scrollbarCmp.externalSpacer()).toBeDefined();
//
//     viewportElement = fixture.debugElement.query(By.css(scrollbarCmp.externalViewport()))?.nativeElement;
//     const contentWrapperElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalContentWrapper()))?.nativeElement;
//     const spacerElement: HTMLElement = fixture.debugElement.query(By.css(scrollbarCmp.externalSpacer()))?.nativeElement;
//
//     expect(viewportInitSpy).toHaveBeenCalledOnceWith(
//       viewportElement,
//       contentWrapperElement,
//       spacerElement
//     );
//     expect(attachContentSpy).toHaveBeenCalledWith(contentWrapperElement);
//     expect(attachScrollbarSpy).toHaveBeenCalledWith(spacerElement);
//
//     await firstValueFrom(outputToObservable(scrollbarCmp.afterInit));
//
//     verifyExpectedElements(spacerElement);
//     verifyDestroyed();
//   });
//
//   it('should log error if viewport does not exist', () => {
//     setupTest(WithViewportDirectiveAndInputsComponent, null);
//     spyOnError();
//
//     expect(viewportInitSpy).not.toHaveBeenCalled();
//     expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Could not find the viewport element for the provided selector "${ scrollbarCmp.externalViewport() }"`);
//   });
//
//   it('should log error if content wrapper does not exist', () => {
//     setupTest(WithViewportDirectiveAndInputsComponent, '.my-custom-viewport', '.not-existing-content-wrapper');
//     spyOnError();
//
//     expect(viewportInitSpy).not.toHaveBeenCalled();
//     expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Content wrapper element not found for the provided selector "${ scrollbarCmp.externalContentWrapper() }"`);
//   });
//
//   it('should log error if spacer does not exist', () => {
//     setupTest(WithViewportDirectiveAndInputsComponent, '.my-custom-viewport', '.my-custom-content-wrapper', '.not-existing-spacer');
//     spyOnError();
//
//     expect(viewportInitSpy).not.toHaveBeenCalled();
//     expect(consoleSpy).toHaveBeenCalledOnceWith(`[NgScrollbar]: Spacer element not found for the provided selector "${ scrollbarCmp.externalSpacer() }"`);
//   });
// });
