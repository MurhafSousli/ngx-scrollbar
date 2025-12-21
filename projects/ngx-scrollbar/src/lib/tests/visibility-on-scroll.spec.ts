import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal, WritableSignal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { NgScrollbar, NgScrollbarModule, ViewportAdapter } from 'ngx-scrollbar';
import { NgScrollHoverVisibility } from 'ngx-scrollbar/addons';

@Component({
  template: `
    <ng-scrollbar style="width: 100px; height: 100px"
                  visibility="hover"
                  visibleOnScroll
                  [scrollHideDelay]="scrollHideDelay()"
                  [scrollThrottleTime]="scrollThrottleTime()">
      <div style="width: 300px; height: 300px"></div>
    </ng-scrollbar>
  `,
  imports: [NgScrollbarModule, NgScrollHoverVisibility]
})
class TestComponent {
  scrollHideDelay: WritableSignal<number> = signal(400);
  scrollThrottleTime: WritableSignal<number> = signal(200);
}

describe('NgScrollHoverVisibility Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let adapter: ViewportAdapter;
  let viewportEl: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();

    fixture = TestBed.createComponent(TestComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    adapter = fixture.debugElement.query(By.directive(NgScrollbar)).injector.get(ViewportAdapter);
    viewportEl = adapter.viewportElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not have scrolling attribute on init', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(viewportEl.getAttribute('scrolling')).toBeNull();
  });

  it('should set scrolling="true" when scroll event is fired', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));

    // Dispatch scroll event
    viewportEl.dispatchEvent(new Event('scroll'));
    expect(viewportEl.getAttribute('scrolling')).toBe('true');
  });

  it('should set scrolling="false" after idle delay', async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));

    // Trigger scroll and move past throttle
    viewportEl.dispatchEvent(new Event('scroll'));
    expect(viewportEl.getAttribute('scrolling')).toBe('true');

    // Advance by the debounce/idle delay
    vi.advanceTimersByTime(component.scrollHideDelay());

    expect(viewportEl.getAttribute('scrolling')).toBe('false');
  });

  it('should reset the hide timer if scrolling continues',async () => {
    await firstValueFrom(outputToObservable(adapter.afterInit));

    // Initial scroll
    viewportEl.dispatchEvent(new Event('scroll'));

    // Advance 300ms (delay is 400ms)
    vi.advanceTimersByTime(300);

    // Second scroll should reset the debounce timer
    viewportEl.dispatchEvent(new Event('scroll'));

    // Advance another 200ms (we are now at 532ms total, but only 216ms since last scroll)
    vi.advanceTimersByTime(200);
    expect(viewportEl.getAttribute('scrolling')).toBe('true');

    // Advance final 200ms to hit the 400ms threshold from the last event
    vi.advanceTimersByTime(200);
    expect(viewportEl.getAttribute('scrolling')).toBe('false');
  });

  it('should handle dynamic timing changes', async () => {
    // Update timing signals
    component.scrollHideDelay.set(1000);
    fixture.detectChanges();
    await firstValueFrom(outputToObservable(adapter.afterInit));

    viewportEl.dispatchEvent(new Event('scroll'));

    // Should still be true at the old 400ms threshold
    vi.advanceTimersByTime(400);
    expect(viewportEl.getAttribute('scrolling')).toBe('true');

    // Should hide at the new 1000ms threshold
    vi.advanceTimersByTime(600);
    expect(viewportEl.getAttribute('scrolling')).toBe('false');
  });
});
