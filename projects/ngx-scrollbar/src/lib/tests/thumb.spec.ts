import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Directionality } from '@angular/cdk/bidi';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { ThumbAdapter } from '../thumb/thumb-adapter';
import { ScrollbarManager } from '../utils/scrollbar-manager';
import { setDimensions } from './common-test.';

describe('Scrollbar thumb', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  const directionalityMock = {
    value: 'ltr',
    change: new BehaviorSubject<string>('ltr'),
  };

  const scrollbarManagerMock = {
    scrollTimelinePolyfill: signal(window['ScrollTimeline'])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: Directionality, useValue: directionalityMock },
        { provide: ScrollbarManager, useValue: scrollbarManagerMock }
      ]
    }).compileComponents();

    directionalityMock.value = 'ltr';

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('appearance', 'compact');
    component.nativeElement.style.setProperty('--scrollbar-offset', '0');
    component.nativeElement.style.setProperty('--scrollbar-thumb-color', 'red');
  });

  it('should set "isDragging" to true and scroll accordingly when vertical scrollbar thumb is being dragged', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 100, contentHeight: 400 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const thumbY: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-thumb')).nativeElement;
    thumbY.dispatchEvent(new PointerEvent('pointerdown'));

    // Verify dragging signal and attribute is set to 'Y'
    expect(component.dragging()).toBe('y');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('y');

    // Drag by 240px (thumb size will be 25px)
    document.dispatchEvent(new PointerEvent('pointermove', { clientY: 240 }));
    expect(component.viewport.scrollTop).toBe(300);

    // Drag back to 0
    document.dispatchEvent(new PointerEvent('pointermove', { clientY: 0 }));
    expect(component.viewport.scrollTop).toBe(0);

    document.dispatchEvent(new PointerEvent('pointerup'));
    expect(component.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });


  it('should set "isDragging" to true and scroll accordingly when horizontal scrollbar is being dragged', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 100 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const thumbX: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-thumb')).nativeElement;
    thumbX.dispatchEvent(new PointerEvent('pointerdown'));

    // Verify dragging signal and attribute is set to 'X'
    expect(component.dragging()).toBe('x');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('x');

    // Drag by 240px (thumb size will be 25px)
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 240 }));
    expect(component.viewport.scrollLeft).toBe(300);

    // Drag back to 0
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 0 }));
    expect(component.viewport.scrollLeft).toBe(0);

    component.viewport.nativeElement.dispatchEvent(new PointerEvent('pointerup'));
    expect(component.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });

  it('[RTL] should set "isDragging" to true and scroll accordingly when horizontal scrollbar is being dragged', async () => {
    directionalityMock.value = 'rtl';

    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 100 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const thumbX: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-thumb')).nativeElement;
    thumbX.dispatchEvent(new PointerEvent('pointerdown'));

    // Verify dragging signal and attribute is set to 'X'
    expect(component.dragging()).toBe('x');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('x');

    // Drag by 240px (thumb size will be 25px)
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: -240 }));
    expect(component.viewport.scrollLeft).toBe(-300);

    // Drag back to 0
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 0 }));
    expect(component.viewport.scrollLeft).toBe(0);

    component.viewport.nativeElement.dispatchEvent(new PointerEvent('pointerup'));
    expect(component.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });


  it('should set the animation when polyfill script is loaded', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 100 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const thumbAdapter: ThumbAdapter = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-thumb')).injector.get(ThumbAdapter);
    expect(thumbAdapter._animation).toBeTruthy();
  });
});
