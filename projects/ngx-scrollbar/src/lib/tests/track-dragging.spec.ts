import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, signal } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { NgScrollbar, NgScrollbarModule, } from 'ngx-scrollbar';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { afterTimeout, setDimensions } from './common-test.';
import { TrackXDirective, TrackYDirective } from '../track/track';
import { ThumbXDirective, ThumbYDirective } from '../thumb/thumb';

describe('Track dragging', () => {
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
        { provide: Directionality, useValue: directionalityMock }
      ],
    }).compileComponents();

    directionalityMock.value = 'ltr';

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;

    component.appearance = signal('compact') as any;
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 500, contentHeight: 500 });
  });

  it('should scroll to bottom progressively when mousedown on the top edge of the track', async () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYDirective));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYDirective));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.bottom - thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(component.viewport.scrollTop).toBe(100);
    // Ongoing click
    await afterTimeout(150);
    expect(component.viewport.scrollTop).toBeGreaterThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(component.viewport.scrollTop).toBeGreaterThanOrEqual(300);
    // Reached end
    await afterTimeout(100);
    expect(component.viewport.scrollTop).toBe(400);
  });

  it('should scroll to top progressively when mousedown on the bottom edge of the track', async () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    await component.scrollTo({ bottom: 0 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYDirective));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYDirective));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.top + thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(component.viewport.scrollTop).toBe(300);
    // Ongoing click
    await afterTimeout(150);
    expect(component.viewport.scrollTop).toBeLessThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(component.viewport.scrollTop).toBeLessThanOrEqual(100);
    // Reached end
    await afterTimeout(100);
    expect(component.viewport.scrollTop).toBe(0);
  });

  it('should scroll to end progressively when mousedown on the right edge of the track', async () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXDirective));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXDirective));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.right - thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    // First click
    await afterTimeout(200);
    expect(component.viewport.scrollLeft).toBe(100);
    // Ongoing click
    await afterTimeout(150);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(300);
    // Reached end
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBe(400);
  });

  it('should scroll to start progressively when mousedown on the left edge of the track', async () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    await component.scrollTo({ end: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXDirective));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXDirective));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.left + thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    await afterTimeout(200);
    expect(component.viewport.scrollLeft).toBe(300);
    // Ongoing click
    await afterTimeout(150);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(100);
    // Reached end
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBe(0);
  })

  it('should scroll to end progressively when mousedown on the left edge of the track in RTL', async () => {
    directionalityMock.value = 'rtl';

    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    await component.scrollTo({ start: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXDirective));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXDirective));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.left + thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    await afterTimeout(200);
    expect(component.viewport.scrollLeft).toBe(-100);
    // Ongoing click
    await afterTimeout(150);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(-200);
    // Ongoing click
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBeLessThanOrEqual(-300);
    // Reached end
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBe(-400);
  });

  it('should scroll to start progressively when mousedown on the right edge of the track in RTL', async () => {
    directionalityMock.value = 'rtl';

    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    await component.scrollTo({ end: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXDirective));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXDirective));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.right - thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    await afterTimeout(200);
    expect(component.viewport.scrollLeft).toBe(-300);
    // Ongoing click
    await afterTimeout(150);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(-200);
    // Ongoing click
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBeGreaterThanOrEqual(-100);
    // Reached end
    await afterTimeout(100);
    expect(component.viewport.scrollLeft).toBe(0);
  });
});
