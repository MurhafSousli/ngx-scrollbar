import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbar } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { setDimensions } from './common-test.';

describe('NgScrollbar Component', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar]
    }).compileComponents();

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create <ng-scrollbar> component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and viewport', () => {
    // component.ngOnInit();
    expect(component).toBeDefined();
    expect(component.viewport).toBeDefined();
  });


  it('should emit afterUpdate after update function is called', async () => {
    const afterUpdateEmitSpy: jasmine.Spy = spyOn(component.afterUpdate, 'emit');
    component.update();
    expect(afterUpdateEmitSpy).toHaveBeenCalled();
  });


  it('should show vertical scrollbar when viewport is scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });

    await firstValueFrom(outputToObservable(component.afterInit))

    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeTrue();
    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
  });

  it('should show vertical scrollbar if visibility="visible" even if viewport is not scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpHeight: 1000, contentHeight: 300 });

    await firstValueFrom(outputToObservable(component.afterInit))

    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeFalse();
    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
  });

  it('should not show vertical scrollbar when viewport is not scrollable', () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpWidth: 1000, cmpHeight: 1000, contentHeight: 300 });

    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
  });

  it('should show horizontal scrollbar if viewport is horizontally scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpWidth: 300, contentHeight: 300, contentWidth: 1000 });

    await firstValueFrom(outputToObservable(component.afterInit))

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeTrue();
    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });


  it('should show horizontal scrollbar if visibility="visible" even if viewport is not scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpWidth: 1000, contentHeight: 300, contentWidth: 300 });

    await firstValueFrom(outputToObservable(component.afterInit))

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeFalse();
    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });

  it('should not show horizontal scrollbar if viewport is not scrollable', () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('visibility', 'native');
    setDimensions(component, { cmpWidth: 1000, contentHeight: 300, contentWidth: 300 });

    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });

  it('should show all scrollbars if visibility="visible"', async () => {
    fixture.componentRef.setInput('orientation', 'auto');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpWidth: 1000, cmpHeight: 1000, contentHeight: 300, contentWidth: 300 });

    await firstValueFrom(outputToObservable(component.afterInit))

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeFalse();
    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });

  it('should show all scrollbars if viewport is vertically and horizontally scrollable', async () => {
    fixture.componentRef.setInput('orientation', 'auto');
    fixture.componentRef.setInput('visibility', 'visible');
    setDimensions(component, { cmpWidth: 200, cmpHeight: 200, contentHeight: 300, contentWidth: 300 });

    await firstValueFrom(outputToObservable(component.afterInit))

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeTrue();
    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeTrue();
  });

  it('[Auto-height]: component height and width should match content size by default', () => {
    fixture.componentRef.setInput('orientation', 'auto');
    setDimensions(component, { contentHeight: 300, contentWidth: 300 });

    const scrollbarY: DebugElement = fixture.debugElement.query(By.css('scrollbar-y'));
    const scrollbarX: DebugElement = fixture.debugElement.query(By.css('scrollbar-x'));

    expect(scrollbarY).toBeFalsy();
    expect(component.verticalUsed()).toBeFalsy();
    expect(scrollbarX).toBeFalsy();
    expect(component.horizontalUsed()).toBeFalsy();
    expect(getComputedStyle(component.nativeElement).height).toBe('300px');
  });

  it('should forward scrollToElement function call to SmoothScrollManager service', async () => {
    setDimensions(component, { contentHeight: 300, contentWidth: 300 });

    const smoothScrollSpy: jasmine.Spy = spyOn(component.smoothScroll, 'scrollToElement');

    await firstValueFrom(outputToObservable(component.afterInit))

    component.scrollToElement('.fake-child-element', { top: 100, duration: 500 })

    expect(smoothScrollSpy).toHaveBeenCalledOnceWith(component.viewport.nativeElement, '.fake-child-element', {
      top: 100,
      duration: 500
    });
  });
});

