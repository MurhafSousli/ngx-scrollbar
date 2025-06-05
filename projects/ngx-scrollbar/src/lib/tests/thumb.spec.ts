import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Directionality } from '@angular/cdk/bidi';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { ThumbAdapter } from '../thumb/thumb-adapter';
import { ScrollbarManager } from '../utils/scrollbar-manager';
import { setDimensions } from './common-test.';

describe('Scrollbar thumb', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  const directionalityMock = {
    value: 'ltr',
    change: new BehaviorSubject<string>('ltr'),
  };

  const scrollbarManagerMock = {
    scrollTimelinePolyfill: signal(window['ScrollTimeline'])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Directionality, useValue: directionalityMock },
        { provide: ScrollbarManager, useValue: scrollbarManagerMock }
      ]
    }).compileComponents();

    directionalityMock.value = 'ltr';
    directionalityMock.change.next('ltr');

    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);

    fixture.componentRef.setInput('appearance', 'compact');
    component.nativeElement.style.setProperty('--scrollbar-offset', '0');
    component.nativeElement.style.setProperty('--scrollbar-thumb-color', 'red');
  });

  it('should set "isDragging" to true and scroll accordingly when vertical scrollbar thumb is being dragged', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 400 });
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const thumbY: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-thumb')).nativeElement;
    thumbY.dispatchEvent(new PointerEvent('pointerdown'));

    // Verify dragging signal and attribute is set to 'Y'
    expect(adapter.dragging()).toBe('y');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('y');

    // Drag by 240px (thumb size will be 25px)
    document.dispatchEvent(new PointerEvent('pointermove', { clientY: 240 }));
    expect(component.adapter.scrollTop).toBe(300);

    // Drag back to 0
    document.dispatchEvent(new PointerEvent('pointermove', { clientY: 0 }));
    expect(component.adapter.scrollTop).toBe(0);

    document.dispatchEvent(new PointerEvent('pointerup'));
    expect(adapter.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });


  it('should set "isDragging" to true and scroll accordingly when horizontal scrollbar is being dragged', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 100 });
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const thumbX: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-thumb')).nativeElement;
    thumbX.dispatchEvent(new PointerEvent('pointerdown'));

    // Verify dragging signal and attribute is set to 'X'
    expect(adapter.dragging()).toBe('x');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('x');

    // Drag by 240px (thumb size will be 25px)
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 240 }));
    expect(component.adapter.scrollLeft).toBe(300);

    // Drag back to 0
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 0 }));
    expect(component.adapter.scrollLeft).toBe(0);

    component.adapter.viewportElement.dispatchEvent(new PointerEvent('pointerup'));
    expect(adapter.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });

  it('[RTL] should set "isDragging" to true and scroll accordingly when horizontal scrollbar is being dragged', async () => {
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');

    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 100 });
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const thumbX: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-thumb')).nativeElement;
    thumbX.dispatchEvent(new PointerEvent('pointerdown'));

    // Verify dragging signal and attribute is set to 'X'
    expect(adapter.dragging()).toBe('x');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('x');

    // Drag by 240px (thumb size will be 25px)
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: -240 }));
    expect(component.adapter.scrollLeft).toBe(-300);

    // Drag back to 0
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 0 }));
    expect(component.adapter.scrollLeft).toBe(0);

    component.adapter.viewportElement.dispatchEvent(new PointerEvent('pointerup'));
    expect(adapter.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });


  it('should set the animation when polyfill script is loaded', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 100 });
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const thumbAdapter: ThumbAdapter = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-thumb')).injector.get(ThumbAdapter);
    expect(thumbAdapter._animation).toBeTruthy();
  });
});
