import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal, WritableSignal } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { NgScrollbar, NgScrollbarModule, ViewportAdapter } from 'ngx-scrollbar';
import { NgScrollReachDrop } from 'ngx-scrollbar/reached-event';

@Component({
  template: `
    <ng-scrollbar style="width: 100px; height: 100px"
                  (reachedTop)="onScrollReached('top')"
                  (reachedBottom)="onScrollReached('bottom')"
                  (reachedStart)="onScrollReached('start')"
                  (reachedEnd)="onScrollReached('end')"
                  [reachedTopOffset]="topOffset()"
                  [reachedBottomOffset]="bottomOffset()"
                  [reachedStartOffset]="startOffset()"
                  [reachedEndOffset]="endOffset()"
                  [disableReached]="disableReached()"
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
  disableReached: WritableSignal<boolean> = signal(false);

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
  });

  it('[ReachedOffset]: should emit (reachedTop) (reachedBottom) (reachedStart) (reachedEnd)', async () => {
    const scrollTo: number = 0;

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

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
    component.topOffset.set(10);
    const scrollTo: number = component.topOffset() - 1;

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ bottom: 0, duration: 0 });
    await adapter.scrollTo({ top: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('top');
  });

  it('[ReachedBottomEvent]: should emit (reachedBottom)', async () => {
    component.bottomOffset.set(10);
    const scrollTo: number = component.bottomOffset() - 1;

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ top: 0, duration: 0 });
    await adapter.scrollTo({ bottom: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('bottom');
  });

  it('[ReachedStartEvent]: should emit (reachedStart)', async () => {
    component.startOffset.set(10);
    const scrollTo: number = component.startOffset() - 1;

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ end: 0, duration: 0 });
    await adapter.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedEndEvent]: should emit (reachedEnd)', async () => {
    component.endOffset.set(10);
    const scrollTo: number = component.endOffset() - 1;

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ start: 0, duration: 0 });
    await adapter.scrollTo({ end: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
  });

  it('[ReachedStartEvent]: should emit (reachedStart) in RTL mode', async () => {
    component.startOffset.set(10);
    component.isRtl.set(true);
    const scrollTo: number = component.startOffset() - 1;

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ end: 0, duration: 0 });
    await adapter.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedEndEvent]: should emit (reachedEnd) in RTL mode', async () => {
    component.endOffset.set(10);
    component.isRtl.set(true);
    const scrollTo: number = component.startOffset() - 1;

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ start: 0, duration: 0 });
    await adapter.scrollTo({ end: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
  });


  it('[disableReached]: should not emit when scroll is reached destination', async () => {
    component.disableReached.set(true);

    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    await adapter.scrollTo({ top: 0, duration: 0 });
    await adapter.scrollTo({ bottom: 0, duration: 50 });
    expect(onScrollReachedSpy).not.toHaveBeenCalledWith('bottom');
  });
});
