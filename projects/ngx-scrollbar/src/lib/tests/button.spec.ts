import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Directionality } from '@angular/cdk/bidi';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { provideSmoothScrollOptions } from 'ngx-scrollbar/smooth-scroll';
import { afterTimeout, setDimensions } from './common-test.';
import { ScrollbarButton } from '../button/scrollbar-button.component';

describe('Buttons', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  const directionalityMock = {
    value: 'ltr',
    change: new BehaviorSubject<string>('ltr'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbarModule],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: Directionality, useValue: directionalityMock },
        provideSmoothScrollOptions({
          easing: {
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 1
          }
        })
      ],
    }).compileComponents();

    directionalityMock.value = 'ltr';

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('appearance', 'compact');
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 200, contentHeight: 200 });
  });

  it('should not display the scrollbar buttons when [buttons]="false"', async () => {
    fixture.componentRef.setInput('buttons', false);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const buttons: DebugElement[] = fixture.debugElement.queryAll(By.directive(ScrollbarButton));
    expect(buttons.length).toBeFalsy();
  });

  it('should display buttons when [buttons]="true"', async () => {
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const buttons: DebugElement[] = fixture.debugElement.queryAll(By.directive(ScrollbarButton));
    expect(buttons.length).toBeTruthy();
  });

  it('should scroll to bottom on arrow-down button click', async () => {
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="bottom"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));

    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollTop).toBe(50);

    // Ongoing click
    await afterTimeout(130 + 16 + 16);
    expect(component.viewport.scrollTop).toBeGreaterThanOrEqual(62);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBeGreaterThanOrEqual(74);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBeGreaterThanOrEqual(86);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBeGreaterThanOrEqual(98);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBe(100);
  });


  it('should scroll to top on arrow-up button click', async () => {
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    await component.scrollTo({ bottom: 0, duration: 0 });

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="top"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));

    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollTop).toBe(50);

    // Ongoing click
    await afterTimeout(130 + 16 + 16);
    expect(component.viewport.scrollTop).toBeLessThanOrEqual(38);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBeLessThanOrEqual(26);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBeLessThanOrEqual(14);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBeLessThanOrEqual(2);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollTop).toBe(0);
  });

  it('should scroll to right on arrow-right button click', async () => {
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="end"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));

    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollLeft).toBe(50);

    // Ongoing click
    await afterTimeout(130 + 16 + 16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(62);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(74);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(86);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(98);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBe(100);
  });


  it('should scroll to left on arrow-left button click', async () => {
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    await component.scrollTo({ end: 0, duration: 0 });

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="start"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));

    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollLeft).toBe(50);

    // Ongoing click
    await afterTimeout(130 + 16 + 16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(38);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(26);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(14);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(2);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBe(0);
  });


  it('[RTL] should scroll to left on arrow-left button click', async () => {
    directionalityMock.value = 'rtl';
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="end"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));

    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollLeft).toBe(-50);

    // Ongoing click
    await afterTimeout(130 + 16 + 16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(-62);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(-74);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(-86);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(-98);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBe(-100);
  });

  it('[RTL] should scroll to right on arrow-right button click', async () => {
    directionalityMock.value = 'rtl';
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    await component.scrollTo({ end: 0, duration: 0 });

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="start"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));

    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollLeft).toBe(-50);

    // Ongoing click
    await afterTimeout(130 + 16 + 16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(-38);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(-26);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(-14);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(-2);
    // Ongoing click
    await afterTimeout(16);
    expect(component.viewport.scrollLeft).toBe(0);
  });


  it('should stop scrolling when pointer is up', async () => {
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="bottom"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));

    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollTop).toBe(50);

    button.nativeElement.dispatchEvent(new PointerEvent('pointerup'));

    await afterTimeout(100);
    expect(component.viewport.scrollTop).toBe(50);
  });

  it('should stop scrolling when pointer leaves the button', async () => {
    fixture.componentRef.setInput('buttons', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const button: DebugElement = fixture.debugElement.query(By.css('button[scrollbarButton="bottom"]'));
    button.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));


    // First click
    await afterTimeout(100 + 16);
    expect(component.viewport.scrollTop).toBe(50);

    button.nativeElement.dispatchEvent(new PointerEvent('pointerleave'));

    await afterTimeout(100);
    expect(component.viewport.scrollTop).toBe(50);
  });
});
