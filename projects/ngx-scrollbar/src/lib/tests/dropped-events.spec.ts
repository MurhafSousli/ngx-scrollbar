import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal, WritableSignal } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { firstValueFrom } from 'rxjs';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { vi } from 'vitest';
import { NgScrollbar, NgScrollbarModule, ViewportAdapter } from 'ngx-scrollbar';
import { NgScrollReachDrop } from 'ngx-scrollbar/reached-event';
import { SmoothScrollToOptions } from 'ngx-scrollbar/smooth-scroll';

@Component({
  template: `
    <ng-scrollbar style="width: 100px; height: 100px"
                  (droppedTop)="onScrollDropped('top')"
                  (droppedBottom)="onScrollDropped('bottom')"
                  (droppedStart)="onScrollDropped('start')"
                  (droppedEnd)="onScrollDropped('end')"
                  [droppedTopOffset]="topOffset()"
                  [droppedBottomOffset]="bottomOffset()"
                  [droppedStartOffset]="startOffset()"
                  [droppedEndOffset]="endOffset()"
                  [disableDropped]="disableDropped()"
                  [dir]="isRtl() ? 'rtl' : 'ltr'">
      <div style="width: 300px; height: 300px"></div>
    </ng-scrollbar>
  `,
  imports: [BidiModule, NgScrollbarModule, NgScrollReachDrop]
})
class TestComponent {
  topOffset: WritableSignal<number> = signal(null);
  bottomOffset: WritableSignal<number> = signal(null);
  startOffset: WritableSignal<number> = signal(null);
  endOffset: WritableSignal<number> = signal(null);
  isRtl: WritableSignal<boolean> = signal(false);
  disableDropped: WritableSignal<boolean> = signal(false);

  onScrollDropped(value: string): void {
    console.log(value);
  }
}

describe('Dropped Events Directives', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let adapter: ViewportAdapter;
  let onScrollDroppedSpy;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    adapter = fixture.debugElement.query(By.directive(NgScrollbar)).injector.get(ViewportAdapter);
    fixture.autoDetectChanges();
    onScrollDroppedSpy = vi.spyOn(component, 'onScrollDropped');
  });

  // Helper to DRY up the stability logic
  const verifyScroll = async (direction: string, initialOptions: SmoothScrollToOptions, targetOptions: SmoothScrollToOptions) => {
    await adapter.scrollTo(initialOptions);
    await adapter.scrollTo(targetOptions);
    expect(onScrollDroppedSpy).toHaveBeenCalledWith(direction);
  };

  it('[DroppedOffset]: should emit (droppedTop) (droppedBottom) (droppedStart) (droppedEnd)', async () => {
    await verifyScroll('top', { top: 0, duration: 0 }, { top: 11, duration: 50 });
    await verifyScroll('bottom', { bottom: 0, duration: 0 }, { bottom: 11, duration: 50 });
    await verifyScroll('end', { end: 0, duration: 0 }, { end: 11, duration: 50 });
    await verifyScroll('start', { start: 0, duration: 0 }, { start: 11, duration: 50 });
  });

  it('[DroppedTopEvent]: should emit (droppedTop)', async () => {
    component.topOffset.set(10);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await verifyScroll('top', { top: 0, duration: 0 }, { top: 11, duration: 50 });
  });

  it('[DroppedBottomEvent]: should emit (droppedBottom)', async () => {
    component.bottomOffset.set(10);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await verifyScroll('bottom', { bottom: 0, duration: 0 }, { bottom: 11, duration: 50 });
  });

  it('[DroppedStartEvent]: should emit (droppedStart)', async () => {
    component.startOffset.set(10);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await verifyScroll('start', { start: 0, duration: 0 }, { start: 11, duration: 50 });
  });

  it('[DroppedEndEvent]: should emit (droppedEnd)', async () => {
    component.endOffset.set(10);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await verifyScroll('end', { end: 0, duration: 0 }, { end: 11, duration: 50 });
  });

  it('[DroppedStartEvent]: should emit (droppedStart) in RTL mode', async () => {
    component.startOffset.set(10);
    component.isRtl.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await verifyScroll('start', { start: 0, duration: 0 }, { start: 11, duration: 50 });
  });

  it('[DroppedEndEvent]: should emit (droppedEnd) in RTL mode', async () => {
    component.endOffset.set(10);
    component.isRtl.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await verifyScroll('end', { end: 0, duration: 50 }, { end: 11, duration: 50 });
  });

  it('[disableDropped]: should not emit when scroll is dropped destination', async () => {
    component.disableDropped.set(true);
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ bottom: 0, duration: 0 });
    await adapter.scrollTo({ bottom: 11, duration: 50 });
    expect(onScrollDroppedSpy).not.toHaveBeenCalledWith('bottom');
  });
});
