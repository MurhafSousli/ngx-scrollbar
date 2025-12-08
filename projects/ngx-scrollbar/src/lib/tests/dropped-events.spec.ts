import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { vi } from 'vitest';
import { NgScrollbar, NgScrollbarModule, ViewportAdapter } from 'ngx-scrollbar';
import { NgScrollReachDrop } from 'ngx-scrollbar/reached-event';
import { afterTimeout } from './common-test.';

@Component({
  template: `
    <ng-scrollbar style="width: 100px; height: 100px"
                  (droppedTop)="onScrollDropped('top')"
                  (droppedBottom)="onScrollDropped('bottom')"
                  (droppedStart)="onScrollDropped('start')"
                  (droppedEnd)="onScrollDropped('end')"
                  [droppedTopOffset]="topOffset"
                  [droppedBottomOffset]="bottomOffset"
                  [droppedStartOffset]="startOffset"
                  [droppedEndOffset]="endOffset"
                  [disableDropped]="disableDropped"
                  [dir]="isRtl ? 'rtl' : 'ltr'">
      <div style="width: 300px; height: 300px"></div>
    </ng-scrollbar>
  `,
  imports: [BidiModule, NgScrollbarModule, NgScrollReachDrop]
})
class TestComponent {
  topOffset: number;
  bottomOffset: number;
  startOffset: number;
  endOffset: number;
  isRtl: boolean = false;
  disableDropped: boolean = false;

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

    // After upgrading to vitest - this is needed for some tests
    await afterTimeout(6);
  });

  it('[DroppedOffset]: should emit (droppedTop) (droppedBottom) (droppedStart) (droppedEnd)', async () => {
    await adapter.scrollTo({ top: 0, duration: 0 });
    await adapter.scrollTo({ top: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('top');
    await adapter.scrollTo({ bottom: 0, duration: 0 });
    await adapter.scrollTo({ bottom: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('bottom');
    await adapter.scrollTo({ end: 0, duration: 0 });
    await adapter.scrollTo({ end: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('end');
    await adapter.scrollTo({ start: 0, duration: 0 });
    await adapter.scrollTo({ start: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('start');
  });

  it('[DroppedTopEvent]: should emit (droppedTop)', async () => {
    component.topOffset = 10;

    await adapter.scrollTo({ top: 0, duration: 0 });
    await adapter.scrollTo({ top: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('top');
  });

  it('[DroppedBottomEvent]: should emit (droppedBottom)', async () => {
    component.bottomOffset = 10;

    await adapter.scrollTo({ bottom: 0, duration: 10 });
    await adapter.scrollTo({ bottom: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('bottom');
  });

  it('[DroppedStartEvent]: should emit (droppedStart)', async () => {
    component.startOffset = 10;

    await adapter.scrollTo({ start: 0, duration: 0 });
    await adapter.scrollTo({ start: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('start');
  });

  it('[DroppedEndEvent]: should emit (droppedEnd)', async () => {
    component.endOffset = 10;

    await adapter.scrollTo({ end: 0, duration: 0 });
    await adapter.scrollTo({ end: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('end');
  });

  it('[DroppedStartEvent]: should emit (droppedStart) in RTL mode', async () => {
    component.startOffset = 10;
    component.isRtl = true;

    await adapter.scrollTo({ start: 0, duration: 0 });
    await adapter.scrollTo({ start: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('start');
  });

  it('[DroppedEndEvent]: should emit (droppedEnd) in RTL mode', async () => {
    component.endOffset = 10;
    component.isRtl = true;

    await adapter.scrollTo({ end: 0, duration: 0 });
    await adapter.scrollTo({ end: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('end');
  });

  it('[disableDropped]: should not emit when scroll is dropped destination', async () => {
    component.disableDropped = true;

    await adapter.scrollTo({ bottom: 0, duration: 0 });
    await adapter.scrollTo({ bottom: 11, duration: 50 });
    expect(onScrollDroppedSpy).not.toHaveBeenCalledWith('bottom');
  });
});
