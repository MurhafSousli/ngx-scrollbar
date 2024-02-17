// import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, waitForAsync } from '@angular/core/testing';
// import { NgScrollbar, ViewportClasses } from 'ngx-scrollbar';
//
//
// describe('Viewport Adapter', () => {
//   let component: NgScrollbar;
//   let fixture: ComponentFixture<NgScrollbar>;
//   // let directiveElement: DebugElement;
//
//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [NgScrollbar],
//       providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
//     }).compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(NgScrollbar);
//     component = fixture.componentInstance;
//   });
//
//   afterEach(() => {
//     fixture.destroy();
//   });
//
//   it('should have a default viewport element and its content', () => {
//     expect(component.viewport).toBeDefined();
//     expect(component.viewport.contentWrapperElement).toBeDefined();
//   });
//
//   it('should have set the proper classes on viewport and scrollbars elements', () => {
//     expect(component.viewport.nativeElement.classList.contains(ViewportClasses.Viewport)).toBeTrue();
//     expect(component.viewport.contentWrapperElement.classList.contains(ViewportClasses.Content)).toBeTrue();
//   });
//
//
//   it('should initialize viewport', () => {
//     component.sensorDebounceTimeSetter = 100;
//     component.disableSensorSetter = true;
//     component.ngOnInit();
//     const spy = spyOn(component.viewport, 'init');
//     // expect(spy).toHaveBeenCalledOnceWith({
//     //   sensorDebounceTime: 100,
//     //   disableSensor: true,
//     //   mouseMovePropagationDisabled: this.mousemovePropagationDisabled
//     // });
//   });
//
//   // it('should create the default viewport element', () => {
//   //   expect(directiveElement).toBeDefined();
//   // });
//   //
//   // it('should set on the custom viewport element', () => {
//   //
//   // });
//   //
//   // it('should set the viewClass on the viewport', () => {
//   //
//   // });
//
//
//
//   // it('[viewClass]: viewport should add the classes to selected viewport classes', () => {
//   //   component.viewClass = 'test1 test2';
//   //   component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
//   //   component.ngOnInit();
//   //   component.ngAfterViewInit();
//   //   fixture.detectChanges();
//   //
//   //   // expect(component['scrollbarY']).toBeFalsy();
//   //   expect(component.viewport.nativeElement).toContain('test1');
//   // });
// });
