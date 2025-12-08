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
                  (reachedTop)="onScrollReached('top')"
                  (reachedBottom)="onScrollReached('bottom')"
                  (reachedStart)="onScrollReached('start')"
                  (reachedEnd)="onScrollReached('end')"
                  [reachedTopOffset]="topOffset"
                  [reachedBottomOffset]="bottomOffset"
                  [reachedStartOffset]="startOffset"
                  [reachedEndOffset]="endOffset"
                  [disableReached]="disableReached"
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
  disableReached: boolean = false;

  onScrollReached(value: string): void {
    console.log(value);
  }
}

describe('Reached Events Directives', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let adapter: ViewportAdapter;
  let onScrollReachedSpy;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    adapter = fixture.debugElement.query(By.directive(NgScrollbar)).injector.get(ViewportAdapter);
    fixture.autoDetectChanges();
    onScrollReachedSpy = vi.spyOn(component, 'onScrollReached');

    // After upgrading to vitest - this is needed for some tests
    // await fixture.whenRenderingDone();
  });

  it('[ReachedOffset]: should emit (reachedTop) (reachedBottom) (reachedStart) (reachedEnd)', async () => {
    const scrollTo: number = 0;
    await afterTimeout(20);

    await adapter.scrollTo({ top: scrollTo, duration: 0 });
    await adapter.scrollTo({ bottom: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('bottom');
    await adapter.scrollTo({ top: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('top');
    await adapter.scrollTo({ end: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
    await adapter.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedTopEvent]: should emit (reachedTop)', async () => {
    component.topOffset = 10;
    const scrollTo: number = component.topOffset - 1;
    await afterTimeout(20);

    await adapter.scrollTo({ bottom: 0, duration: 0 });
    await adapter.scrollTo({ top: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('top');
  });

  it('[ReachedBottomEvent]: should emit (reachedBottom)', async () => {
    component.bottomOffset = 10;
    const scrollTo: number = component.bottomOffset - 1;
    await afterTimeout(20);

    await adapter.scrollTo({ top: 0, duration: 0 });
    await adapter.scrollTo({ bottom: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('bottom');
  });

  it('[ReachedStartEvent]: should emit (reachedStart)', async () => {
    component.startOffset = 10;
    const scrollTo: number = component.startOffset - 1;

    await adapter.scrollTo({ end: 0, duration: 0 });
    await adapter.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedEndEvent]: should emit (reachedEnd)', async () => {
    component.endOffset = 10;
    const scrollTo: number = component.endOffset - 1;
    await afterTimeout(20);

    await adapter.scrollTo({ start: 0, duration: 0 });
    await adapter.scrollTo({ end: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
  });

  it('[ReachedStartEvent]: should emit (reachedStart) in RTL mode', async () => {
    component.startOffset = 10;
    component.isRtl = true;
    const scrollTo: number = component.startOffset - 1;
    await afterTimeout(20);

    await adapter.scrollTo({ end: 0, duration: 0 });
    await adapter.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedEndEvent]: should emit (reachedEnd) in RTL mode', async () => {
    component.endOffset = 10;
    component.isRtl = true;
    await afterTimeout(20);

    await adapter.scrollTo({ start: 0, duration: 0 });
    await adapter.scrollTo({ end: 10, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
  });


  it('[disableReached]: should not emit when scroll is reached destination', async () => {
    component.disableReached = true;

    await adapter.scrollTo({ top: 0, duration: 0 });
    await adapter.scrollTo({ bottom: 0, duration: 50 });
    expect(onScrollReachedSpy).not.toHaveBeenCalledWith('bottom');
  });
});
