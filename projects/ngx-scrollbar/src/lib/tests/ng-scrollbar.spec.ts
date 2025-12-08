import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { vi } from 'vitest';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { afterTimeout, setDimensions } from './common-test.';

describe('NgScrollbar Component', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);
    fixture.detectChanges();
  });

  it('should create <ng-scrollbar> component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and viewport', () => {
    expect(component).toBeDefined();
    expect(component.adapter).toBeDefined();
  });

  it('should emit afterUpdate after update function is called', async () => {
    const afterUpdateEmitSpy = vi.spyOn(adapter.afterUpdate, 'emit');
    component.update()
    expect(afterUpdateEmitSpy).toHaveBeenCalled();
  });

  it('should show vertical scrollbar when viewport is scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });

    await firstValueFrom(outputToObservable(adapter.afterInit));

    expect(adapter.verticalUsed()).toBe(true);
    expect(adapter.isVerticallyScrollable()).toBe(true);
    expect(adapter.horizontalUsed()).toBe(false);
    expect(adapter.isHorizontallyScrollable()).toBe(false);
  });

  it('should show vertical scrollbar if visibility="visible" even if viewport is not scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpHeight: 1000, contentHeight: 300 });

    await firstValueFrom(outputToObservable(adapter.afterInit));

    expect(adapter.verticalUsed()).toBe(true);
    expect(adapter.isVerticallyScrollable()).toBe(false);
    expect(adapter.horizontalUsed()).toBe(false);
    expect(adapter.isHorizontallyScrollable()).toBe(false);
  });

  it('should not show vertical scrollbar when viewport is not scrollable', () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpWidth: 1000, cmpHeight: 1000, contentHeight: 300 });

    expect(adapter.verticalUsed()).toBe(false);
    expect(adapter.isVerticallyScrollable()).toBe(false);
    expect(adapter.horizontalUsed()).toBe(false);
    expect(adapter.isHorizontallyScrollable()).toBe(false);
  });

  it('should show horizontal scrollbar if viewport is horizontally scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpWidth: 300, contentHeight: 300, contentWidth: 1000 });

    await firstValueFrom(outputToObservable(adapter.afterInit));

    expect(adapter.horizontalUsed()).toBe(true);
    expect(adapter.isHorizontallyScrollable()).toBe(true);
    expect(adapter.verticalUsed()).toBe(false);
    expect(adapter.isVerticallyScrollable()).toBe(false);
  });


  it('should show horizontal scrollbar if visibility="visible" even if viewport is not scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpWidth: 1000, contentHeight: 300, contentWidth: 300 });

    await firstValueFrom(outputToObservable(adapter.afterInit))

    expect(adapter.horizontalUsed()).toBe(true);
    expect(adapter.isHorizontallyScrollable()).toBe(false);
    expect(adapter.verticalUsed()).toBe(false);
    expect(adapter.isVerticallyScrollable()).toBe(false);
  });

  it('should not show horizontal scrollbar if viewport is not scrollable', () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpWidth: 1000, contentHeight: 300, contentWidth: 300 });

    expect(adapter.horizontalUsed()).toBe(false);
    expect(adapter.isHorizontallyScrollable()).toBe(false);
    expect(adapter.verticalUsed()).toBe(false);
    expect(adapter.isVerticallyScrollable()).toBe(false);
  });

  it('should show all scrollbars if visibility="visible"', async () => {
    fixture.componentRef.setInput('orientation', 'auto');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpWidth: 1000, cmpHeight: 1000, contentHeight: 300, contentWidth: 300 });

    await firstValueFrom(outputToObservable(adapter.afterInit));

    expect(adapter.horizontalUsed()).toBe(true);
    await afterTimeout(2000)
    expect(adapter.isHorizontallyScrollable()).toBe(false);
    expect(adapter.verticalUsed()).toBe(true);
    expect(adapter.isVerticallyScrollable()).toBe(false);
  });

  it('should show all scrollbars if viewport is vertically and horizontally scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'auto');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpWidth: 200, cmpHeight: 200, contentHeight: 300, contentWidth: 300 });

    await firstValueFrom(outputToObservable(adapter.afterInit))

    expect(adapter.horizontalUsed()).toBe(true);
    expect(adapter.isHorizontallyScrollable()).toBe(true);
    expect(adapter.verticalUsed()).toBe(true);
    expect(adapter.isVerticallyScrollable()).toBe(true);
  });

  it('[Auto-height]: component height and width should match content size by default', () => {
    fixture.componentRef.setInput('orientation', 'auto');
    setDimensions(component, { contentHeight: 300, contentWidth: 300 });

    const scrollbarY: DebugElement = fixture.debugElement.query(By.css('scrollbar-y'));
    const scrollbarX: DebugElement = fixture.debugElement.query(By.css('scrollbar-x'));

    expect(scrollbarY).toBeFalsy();
    expect(adapter.verticalUsed()).toBeFalsy();
    expect(scrollbarX).toBeFalsy();
    expect(adapter.horizontalUsed()).toBeFalsy();
    expect(getComputedStyle(component.nativeElement).height).toBe('300px');
  });

  it('should forward scrollToElement function call to SmoothScrollManager service', async () => {
    setDimensions(component, { contentHeight: 300, contentWidth: 300 });

    const smoothScrollSpy = vi.spyOn(adapter.smoothScroll, 'scrollToElement');

    await firstValueFrom(outputToObservable(adapter.afterInit))

    component.scrollToElement('.fake-child-element', { top: 100, duration: 500 })

    expect(smoothScrollSpy).toHaveBeenCalledExactlyOnceWith(component.adapter.viewportElement, '.fake-child-element', {
      top: 100,
      duration: 500
    });
  });

  it('should forward scrollTo function call to SmoothScrollManager service', async () => {
    setDimensions(component, { contentHeight: 300, contentWidth: 300 });

    const smoothScrollSpy = vi.spyOn(adapter.smoothScroll, 'scrollTo');

    await firstValueFrom(outputToObservable(adapter.afterInit))

    component.scrollTo({ top: 100, duration: 500 })

    expect(smoothScrollSpy).toHaveBeenCalledExactlyOnceWith(adapter.viewportElement, {
      top: 100,
      duration: 500
    });
  });
});

