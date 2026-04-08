import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { provideSmoothScrollOptions } from 'ngx-scrollbar/smooth-scroll';
import { firstValueFrom } from 'rxjs';
import { afterTimeout, DirectionalityMock, setDimensions } from './common-test';
import { TrackXComponent, TrackYComponent } from '../track/track';
import { ThumbXComponent, ThumbYComponent } from '../thumb/thumb';

describe('Scrollbar track', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Directionality, useValue: DirectionalityMock },
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

    DirectionalityMock.valueSignal.set('ltr');

    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);

    fixture.componentRef.setInput('appearance', 'compact');

    fixture.detectChanges();
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 500, contentHeight: 500 });
  });

  async function waitForScrollStep(getScrollPosition: () => number, direction: 'forward' | 'backward', steps: number[]): Promise<void> {
    for (const [index, step] of steps.entries()) {
      if (index === 0) {
        // Wait for the initial click and give it extra time
        await vi.waitFor(() => expect(getScrollPosition()).toBe(step));
        await afterTimeout(350);
      } else if (index === steps.length - 1) {
        // Last step
        await vi.waitFor(() => expect(getScrollPosition()).toBe(step));
      } else {
        // Wait for scroll steps
        if (direction === 'forward') {
          await vi.waitFor(() => expect(getScrollPosition()).toBeGreaterThanOrEqual(step));
        } else {
          await vi.waitFor(() => expect(getScrollPosition()).toBeLessThanOrEqual(step));
        }
        await afterTimeout(50);
      }
    }
  }

  it('[Vertical] should scroll to bottom progressively when mousedown on the bottom edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.bottom + trackRect.height - thumbRect.height / 2;

    trackYDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientY, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollTop, 'forward', [100, 200, 300, 400]);
  });

  it('[Vertical] should scroll to top progressively when mousedown on the top edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ bottom: 0, duration: 0 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.top + thumbRect.height / 2;

    trackYDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientY, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollTop, 'backward', [300, 200, 100, 0]);
  });

  it('[RTL Vertical] should scroll to bottom progressively when mousedown on the bottom edge of the track', async () => {
    DirectionalityMock.valueSignal.set('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.bottom + trackRect.height - thumbRect.height / 2;

    trackYDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientY, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollTop, 'forward', [100, 200, 300, 400]);
  });

  it('[RTL Vertical] should scroll to top progressively when mousedown on the top edge of the track', async () => {
    DirectionalityMock.valueSignal.set('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ bottom: 0, duration: 0 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.top + thumbRect.height / 2;

    trackYDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientY, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollTop, 'backward', [300, 200, 100, 0]);
  });

  it('[Horizontal] should scroll to end progressively when mousedown on the right edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.right - thumbRect.width / 2;

    trackXDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientX, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollLeft, 'forward', [100, 200, 300, 400]);
  });

  it('[Horizontal] should scroll to start progressively when mousedown on the left edge of the track', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ end: 0, duration: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.left + thumbRect.width / 2;

    trackXDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientX, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollLeft, 'backward', [300, 200, 100, 0]);
  })

  it('[RTL Horizontal] should scroll to end progressively when mousedown on the left edge of the track in RTL', async () => {
    DirectionalityMock.valueSignal.set('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ start: 0, duration: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.left + thumbRect.width / 2;

    trackXDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientX, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollLeft, 'backward', [-100, -200, -300, -400]);
  });

  it('[RTL Horizontal] should scroll to start progressively when mousedown on the right edge of the track in RTL', async () => {
    DirectionalityMock.valueSignal.set('rtl');

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ end: 0, duration: 0 });

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    const thumbXDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbXComponent));

    const trackRect: DOMRect = trackXDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbXDebugElement.nativeElement.getBoundingClientRect();

    const clientX: number = trackRect.right - thumbRect.width / 2;

    trackXDebugElement.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { clientX, bubbles: true })
    );

    await waitForScrollStep(() => adapter.scrollLeft, 'forward', [-300, -200, -100, 0]);
  });


  it('should scroll to bottom with one step on first click if incremental position exceeds scroll maximum', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    // Make the current scroll position close to bottom, so it triggers only one scroll to the end
    await adapter.scrollTo({ bottom: 100, duration: 50 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));

    const clientY: number = 300;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // Reached end from the first click
    await vi.waitFor(() => expect(adapter.scrollTop).toBe(400));

    // Wait a bit more just to test that scroll will not change when mouse is still down
    await afterTimeout(100);
    await vi.waitFor(() => expect(adapter.scrollTop).toBe(400));
  });


  it('should scroll to top with one step on first click if incremental position exceeds scroll maximum', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit))
    fixture.detectChanges();

    // Make the current scroll position close to top, so it triggers only one scroll step to finish
    await adapter.scrollTo({ top: 50, duration: 0 });

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));

    const clientY: number = 5;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await vi.waitFor(() => expect(adapter.scrollTop).toBe(0));
    // Wait a bit more just to test that scroll will not change when mouse is still down
    await afterTimeout(100);
    await vi.waitFor(() => expect(adapter.scrollTop).toBe(0));
  });

  it('should not scroll when mouse is down and moves away', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));

    let clientY: number = 290;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // First click
    await vi.waitFor(() => expect(adapter.scrollTop).toBe(100));

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
    await vi.waitFor(() => expect(adapter.scrollTop).toBeGreaterThanOrEqual(300));
    // Reached end
    await afterTimeout(100);
    await vi.waitFor(() => expect(adapter.scrollTop).toBe(400));
  });

  it('should scroll only once if destination is one step below the thumb position', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    const thumbYDebugElement: DebugElement = fixture.debugElement.query(By.directive(ThumbYComponent));

    const trackRect: DOMRect = trackYDebugElement.nativeElement.getBoundingClientRect();
    const thumbRect: DOMRect = thumbYDebugElement.nativeElement.getBoundingClientRect();

    const clientY: number = trackRect.top + thumbRect.bottom + thumbRect.height / 2;

    // The event causes the viewport to scroll by 100px
    trackYDebugElement.nativeElement.dispatchEvent(new PointerEvent('pointerdown', { clientY }));

    // Wait a bit, then verify
    await afterTimeout(200);
    await vi.waitFor(() => expect(adapter.scrollTop).toBe(100));
  });

  it('[Horizontal] should return null when the mouse position is inside the thumb boundaries (neutral)', async () => {
    // This test is to cover the 'getScrollDirection' null value
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackXDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackXComponent));
    vi.spyOn(trackXDebugElement.componentInstance, 'getThumbStartPosition').mockReturnValue(20);
    vi.spyOn(trackXDebugElement.componentInstance, 'getThumbEndPosition').mockReturnValue(80);
    expect(trackXDebugElement.componentInstance.getScrollDirection(50)).toBeNull();

    // Do the same for RTL function
    DirectionalityMock.valueSignal.set('rtl');
    fixture.detectChanges();

    vi.spyOn(trackXDebugElement.componentInstance, 'getThumbStartPosition').mockReturnValue(20);
    vi.spyOn(trackXDebugElement.componentInstance, 'getThumbEndPosition').mockReturnValue(80);
    expect(trackXDebugElement.componentInstance.getScrollDirection(50)).toBeNull();
  });

  it('[Vertical] should return null when the mouse position is inside the thumb boundaries (neutral)', async () => {
    // This test is to cover the 'getScrollDirection' null value
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackYDebugElement: DebugElement = fixture.debugElement.query(By.directive(TrackYComponent));
    vi.spyOn(trackYDebugElement.componentInstance, 'getThumbStartPosition').mockReturnValue(20);
    vi.spyOn(trackYDebugElement.componentInstance, 'getThumbEndPosition').mockReturnValue(80);
    expect(trackYDebugElement.componentInstance.getScrollDirection(50)).toBeNull();
  });
});
