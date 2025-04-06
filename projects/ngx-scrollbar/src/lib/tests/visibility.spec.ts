import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbar } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { setDimensions } from './common-test.';
import { TrackYDirective } from '../track/track';

describe('Visibility styles', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
  });

  it('[Visibility] should be hidden when visibility="hover"', async () => {
    fixture.componentRef.setInput('visibility', 'hover');
    await firstValueFrom(outputToObservable(component.afterInit));

    const stickyDebugElement: DebugElement = fixture.debugElement.query(By.css('.ng-scrollbar-sticky'));

    const stickyStyles: CSSStyleDeclaration = getComputedStyle(stickyDebugElement.nativeElement);

    expect(component.nativeElement.getAttribute('visibility')).toBe('hover');
    expect(stickyStyles.opacity).toBe('0');
    expect(stickyStyles.transitionDelay).toBe('1s');
    expect(stickyStyles.transitionDuration).toBe('0.4s');
    expect(stickyStyles.transitionTimingFunction).toBe('ease');
    expect(stickyStyles.transitionProperty).toBe('opacity');
  });

  it('[Visibility] should be able to override styles related to sticky container using CSS variables', async () => {
    fixture.componentRef.setInput('visibility', 'hover');
    // Override track color and transition using CSS variables
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-enter-duration', '200ms');
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-leave-duration', '500ms');
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-leave-delay', '3s');
    await firstValueFrom(outputToObservable(component.afterInit));

    const stickyDebugElement: DebugElement = fixture.debugElement.query(By.css('.ng-scrollbar-sticky'));
    const stickyStyles: CSSStyleDeclaration = getComputedStyle(stickyDebugElement.nativeElement);

    expect(stickyStyles.transitionDelay).toBe('3s');
    expect(stickyStyles.transitionDuration).toBe('0.5s');
    expect(stickyStyles.transitionTimingFunction).toBe('ease');
    expect(stickyStyles.transitionProperty).toBe('opacity');
  });

  it('[Visibility] should be able to override styles related to scrollbar track using CSS variables', async () => {
    // Override track color and transition using CSS variables
    component.nativeElement.style.setProperty('--scrollbar-track-color', 'red');
    await firstValueFrom(outputToObservable(component.afterInit));

    const trackDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYDirective));
    const trackStyles: CSSStyleDeclaration = getComputedStyle(trackDebugElement.nativeElement);

    expect(trackStyles.backgroundColor).toBe('rgb(255, 0, 0)');
  });

});

