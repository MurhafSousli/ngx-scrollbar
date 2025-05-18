import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { provideSmoothScrollOptions } from 'ngx-scrollbar/smooth-scroll';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { afterTimeout, setDimensions } from './common-test.';
import { TrackXComponent, TrackYComponent } from '../track/track';
import { ThumbXComponent, ThumbYComponent } from '../thumb/thumb';

describe('Scrollbar track', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  const directionalityMock = {
    value: 'ltr',
    change: new BehaviorSubject<string>('ltr'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
    directionalityMock.change.next('ltr');

    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);

    fixture.componentRef.setInput('appearance', 'compact');

    TestBed.flushEffects();
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 500, contentHeight: 500 });
  });

  it('[Vertical] should scroll to bottom progressively when mousedown on the bottom edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    TestBed.flushEffects();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.bottom + trackRect.height - thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(adapter.scrollTop).toBe(100);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollTop).toBeGreaterThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollTop).toBeGreaterThanOrEqual(300);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(400);
  });

  it('[Vertical] should scroll to top progressively when mousedown on the top edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    await adapter.scrollTo({ bottom: 0, duration: 0 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.top + thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(adapter.scrollTop).toBe(300);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollTop).toBeLessThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollTop).toBeLessThanOrEqual(100);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(0);
  });

  it('[RTL Vertical] should scroll to bottom progressively when mousedown on the bottom edge of the track', async () => {
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.bottom + trackRect.height - thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(adapter.scrollTop).toBe(100);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollTop).toBeGreaterThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollTop).toBeGreaterThanOrEqual(300);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(400);
  });

  it('[RTL Vertical] should scroll to top progressively when mousedown on the top edge of the track', async () => {
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    await adapter.scrollTo({ bottom: 0, duration: 0 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.top + thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(adapter.scrollTop).toBe(300);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollTop).toBeLessThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollTop).toBeLessThanOrEqual(100);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(0);
  });

  it('[Horizontal] should scroll to end progressively when mousedown on the right edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.right - thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    // First click
    await afterTimeout(200);
    expect(adapter.scrollLeft).toBe(100);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollLeft).toBeGreaterThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBeGreaterThanOrEqual(300);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBe(400);
  });

  it('[Horizontal] should scroll to start progressively when mousedown on the left edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    await adapter.scrollTo({ end: 0, duration: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.left + thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    await afterTimeout(200);
    expect(adapter.scrollLeft).toBe(300);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollLeft).toBeLessThanOrEqual(200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBeLessThanOrEqual(100);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBe(0);
  })

  it('[RTL Horizontal] should scroll to end progressively when mousedown on the left edge of the track in RTL', async () => {
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    await adapter.scrollTo({ start: 0, duration: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.left + thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    await afterTimeout(200);
    expect(adapter.scrollLeft).toBe(-100);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollLeft).toBeLessThanOrEqual(-200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBeLessThanOrEqual(-300);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBe(-400);
  });

  it('[RTL Horizontal] should scroll to start progressively when mousedown on the right edge of the track in RTL', async () => {
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    await adapter.scrollTo({ end: 0, duration: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.right - thumbRect.width / 2;

    // The event causes the viewport to scroll by 100px
    trackXDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientX }));

    await afterTimeout(200);
    expect(adapter.scrollLeft).toBe(-300);
    // Ongoing click
    await afterTimeout(150);
    expect(adapter.scrollLeft).toBeGreaterThanOrEqual(-200);
    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBeGreaterThanOrEqual(-100);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollLeft).toBe(0);
  });


  it('should scroll to bottom with one step on first click if incremental position exceeds scroll maximum', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    // Make the current scroll position close to bottom, so it triggers only one scroll to the end
    await adapter.scrollTo({ bottom: 90, duration: 50 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));

    const clientY: number = 300;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // Reached end from the first click
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(400);
    // Wait a bit more just to test that scroll will not change when mouse is still down
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(400);
  });


  it('should scroll to top with one step on first click if incremental position exceeds scroll maximum', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    // Make the current scroll position close to top, so it triggers only one scroll step to finish
    await adapter.scrollTo({ top: 50, duration: 0 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));

    const clientY: number = 10;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(0);
    // Wait a bit more just to test that scroll will not change when mouse is still down
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(0);
  });

  it('should not scroll when mouse is down and moves away', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));

    let clientY: number = 290;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(adapter.scrollTop).toBe(100);

    // Fake mouse move
    clientY = clientY + 5;
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointermove', { clientY }));

    // Ongoing click
    await afterTimeout(120);

    // fake mouse out
    const scrollTopBeforeMouseOut: number = adapter.scrollTop;

    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerout'));
    await afterTimeout(100);
    // Verify scrollTop hasn't changed after mouse is out
    expect(adapter.scrollTop).toBeGreaterThanOrEqual(scrollTopBeforeMouseOut);

    // Move the mouse back over the track while mouse is down
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerover', { clientY }));

    // Ongoing click
    await afterTimeout(100);
    expect(adapter.scrollTop).toBeGreaterThanOrEqual(300);
    // Reached end
    await afterTimeout(100);
    expect(adapter.scrollTop).toBe(400);
  });

  it('should scroll only once one if destination is one step below the thumb position', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.flushEffects();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.top + thumbRect.bottom + thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await afterTimeout(200);
    expect(adapter.scrollTop).toBe(100);
  });
});
