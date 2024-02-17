// import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
// import { signal } from '@angular/core';
// import { NgScrollbar, ScrollbarVisibility } from 'ngx-scrollbar';
// import { firstValueFrom } from 'rxjs';
// import { setDimensions } from './common-test.';
//
// describe('Visibility styles', () => {
//   let component: NgScrollbar;
//   let fixture: ComponentFixture<NgScrollbar>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [NgScrollbar],
//       providers: [
//         { provide: ComponentFixtureAutoDetect, useValue: true }
//       ],
//     }).compileComponents();
//
//     fixture = TestBed.createComponent(NgScrollbar);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('[Visibility] should be hidden when visibility="hover"', async () => {
//     setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
//     component.visibility = signal<ScrollbarVisibility>('hover') as any;
//     component.ngOnInit();
//     component.ngAfterViewInit();
//     await firstValueFrom(component.afterInit);
//
//     const trackStyles: CSSStyleDeclaration = getComputedStyle(component.scrollbars.y.track.nativeElement);
//
//     expect(component.nativeElement.getAttribute('visibility')).toBe('hover');
//     expect(trackStyles.opacity).toBe('0');
//     expect(trackStyles.transition).toBe('height 0.15s ease-out 0s, width 0.15s ease-out 0s, opacity 0.4s ease 0.8s');
//   });
//
//   it('[Visibility] should set default styles and hover effect', async () => {
//     setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
//     component.ngOnInit();
//     component.ngAfterViewInit();
//     await firstValueFrom(component.afterInit);
//
//     const trackStyles: CSSStyleDeclaration = getComputedStyle(component.scrollbars.y.track.nativeElement);
//
//     expect(component.nativeElement.getAttribute('visibility')).toBe('native');
//     expect(trackStyles.position).toBe('absolute');
//
//     expect(trackStyles.opacity).toBe('1');
//     expect(trackStyles.transition).toBe('height 0.15s ease-out 0s, width 0.15s ease-out 0s');
//     expect(trackStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
//   });
//
//   it('[Visibility] should be able to override styles using CSS variables', async () => {
//     setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
//     // Override track color and transition using CSS variables
//     component.nativeElement.style.setProperty('--scrollbar-track-transition', 'height 0.66s linear, width 0.33s linear');
//     component.nativeElement.style.setProperty('--scrollbar-track-color', 'red');
//     component.visibility = signal<ScrollbarVisibility>('native') as any;
//     component.ngOnInit();
//     component.ngAfterViewInit();
//     await firstValueFrom(component.afterInit);
//
//     const trackStyles: CSSStyleDeclaration = getComputedStyle(component.scrollbars.y.track.nativeElement);
//     expect(trackStyles.transition).toBe('height 0.66s linear 0s, width 0.33s linear 0s');
//     expect(trackStyles.backgroundColor).toBe('rgb(255, 0, 0)');
//   });
// });
//
