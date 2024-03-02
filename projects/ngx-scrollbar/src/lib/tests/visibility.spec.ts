import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, signal } from '@angular/core';
import { NgScrollbar, ScrollbarVisibility } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { setDimensions } from './common-test.';
import { TrackYDirective } from '../track/track';

describe('Visibility styles', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('[Visibility] should be hidden when visibility="hover"', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
    component.visibility = signal<ScrollbarVisibility>('hover') as any;
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const stickyDebugElement: DebugElement = fixture.debugElement.query(By.css('.ng-scrollbar-sticky'));

    const stickyStyles: CSSStyleDeclaration = getComputedStyle(stickyDebugElement.nativeElement);

    expect(component.nativeElement.getAttribute('visibility')).toBe('hover');
    expect(stickyStyles.opacity).toBe('0');
    expect(stickyStyles.transition).toBe('opacity 0.4s ease 1s');
  });

  it('[Visibility] should be able to override styles related to sticky container using CSS variables', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
    component.visibility = signal<ScrollbarVisibility>('hover') as any;
    // Override track color and transition using CSS variables
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-enter-duration', '200ms');
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-leave-duration', '500ms');
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-leave-delay', '3s');
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const stickyDebugElement: DebugElement = fixture.debugElement.query(By.css('.ng-scrollbar-sticky'));
    const stickyStyles: CSSStyleDeclaration = getComputedStyle(stickyDebugElement.nativeElement);

    expect(stickyStyles.transition).toBe('opacity 0.5s ease 3s');
  });

  // it('[Visibility] should set default styles and hover effect', async () => {
  //   setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
  //   component.ngOnInit();
  //   component.ngAfterViewInit();
  //   await firstValueFrom(component.afterInit);
  //
  //   const trackStyles: CSSStyleDeclaration = getComputedStyle(component._scrollbars.y.track.nativeElement);
  //
  //   expect(component.nativeElement.getAttribute('visibility')).toBe('native');
  //   expect(trackStyles.position).toBe('absolute');
  //
  //   expect(trackStyles.opacity).toBe('1');
  //   expect(trackStyles.transition).toBe('height 0.15s ease-out 0s, width 0.15s ease-out 0s');
  //   expect(trackStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  // });
  //
  it('[Visibility] should be able to override styles related to scrollbar track using CSS variables', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
    // Override track color and transition using CSS variables
    component.nativeElement.style.setProperty('--scrollbar-track-transition', 'height 0.66s linear, width 0.33s linear');
    component.nativeElement.style.setProperty('--scrollbar-track-color', 'red');
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYDirective));
    const trackStyles: CSSStyleDeclaration = getComputedStyle(trackDebugElement.nativeElement);

    expect(trackStyles.transition).toBe('height 0.66s linear 0s, width 0.33s linear 0s');
    expect(trackStyles.backgroundColor).toBe('rgb(255, 0, 0)');
  });

});

