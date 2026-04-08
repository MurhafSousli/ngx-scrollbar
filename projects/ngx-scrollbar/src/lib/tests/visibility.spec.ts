import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { setDimensions } from './common-test';

describe('Visibility styles', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 200 });
  });

  it('[Visibility] should be hidden when visibility="hover"', async () => {
    fixture.componentRef.setInput('visibility', 'hover');
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const stickyDebugElement: DebugElement = fixture.debugElement.query(By.css('scrollbar-y.ng-scrollbar-sticky'));

    expect(component.nativeElement).toHaveAttribute('visibility', 'hover');

    expect(stickyDebugElement.nativeElement).toHaveStyle({
      opacity: '0',
      transitionDelay: '1s',
      transitionDuration: '0.4s',
      transitionProperty: 'opacity',
      transitionTimingFunction: 'ease'
    });
  });

  it('[Visibility] should be able to override styles related to sticky container using CSS variables', async () => {
    fixture.componentRef.setInput('visibility', 'hover');
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    // Override track color and transition using CSS variables
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-enter-duration', '200ms');
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-leave-duration', '500ms');
    component.nativeElement.style.setProperty('--scrollbar-hover-opacity-transition-leave-delay', '3s');
    fixture.detectChanges();

    const stickyDebugElement: DebugElement = fixture.debugElement.query(By.css('scrollbar-y.ng-scrollbar-sticky'));

    expect(stickyDebugElement.nativeElement).toHaveStyle({
      transitionDelay: '3s',
      transitionDuration: '0.5s',
      transitionProperty: 'opacity',
      transitionTimingFunction: 'ease'
    });
  });

  it('[Visibility] should be able to override styles related to scrollbar track using CSS variables', async () => {
    // Override track color and transition using CSS variables
    component.nativeElement.style.setProperty('--scrollbar-track-color', 'red');
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackDebugElement: DebugElement = fixture.debugElement.query(By.css('.track-inner'));

    expect(trackDebugElement.nativeElement).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)'
    });
  });

});

