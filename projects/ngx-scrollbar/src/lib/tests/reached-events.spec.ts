import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollReachDrop } from 'ngx-scrollbar/reached-event';

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
                  [disableReached]="disabled"
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
  disabled: boolean = false;

  @ViewChild(NgScrollbar, { static: true }) scrollbar: NgScrollbar;

  onScrollReached(value: string): void {
    console.log(value);
  }
}

describe('Reached Events Directives', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let onScrollReachedSpy: jasmine.Spy;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    onScrollReachedSpy = spyOn(component, 'onScrollReached');
  });

  it('[ReachedOffset]: should emit (reachedTop) (reachedBottom) (reachedStart) (reachedEnd)', async () => {
    fixture.detectChanges();
    const scrollTo: number = 0;

    await component.scrollbar.scrollTo({ top: scrollTo, duration: 0 });
    await component.scrollbar.scrollTo({ bottom: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('bottom');
    await component.scrollbar.scrollTo({ top: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('top');
    await component.scrollbar.scrollTo({ end: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
    await component.scrollbar.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedTopEvent]: should emit (reachedTop)', async () => {
    component.topOffset = 10;
    fixture.detectChanges();
    const scrollTo: number = component.topOffset - 1;

    await component.scrollbar.scrollTo({ bottom: 0, duration: 0 });
    await component.scrollbar.scrollTo({ top: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('top');
  });

  it('[ReachedBottomEvent]: should emit (reachedBottom)', async () => {
    component.bottomOffset = 10;
    fixture.detectChanges();
    const scrollTo: number = component.bottomOffset - 1;

    await component.scrollbar.scrollTo({ top: 0, duration: 0 });
    await component.scrollbar.scrollTo({ bottom: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('bottom');
  });

  it('[ReachedStartEvent]: should emit (reachedStart)', async () => {
    component.startOffset = 10;
    fixture.detectChanges();
    const scrollTo: number = component.startOffset - 1;

    await component.scrollbar.scrollTo({ end: 0, duration: 0 });
    await component.scrollbar.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedEndEvent]: should emit (reachedEnd)', async () => {
    component.endOffset = 10;
    fixture.detectChanges();
    const scrollTo: number = component.endOffset - 1;

    await component.scrollbar.scrollTo({ start: 0, duration: 0 });
    await component.scrollbar.scrollTo({ end: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
  });

  it('[ReachedStartEvent]: should emit (reachedStart) in RTL mode', async () => {
    component.startOffset = 10;
    component.isRtl = true;
    fixture.detectChanges();
    const scrollTo: number = component.startOffset - 1;

    await component.scrollbar.scrollTo({ end: 0, duration: 0 });
    await component.scrollbar.scrollTo({ start: scrollTo, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('start');
  });

  it('[ReachedEndEvent]: should emit (reachedEnd) in RTL mode', async () => {
    component.endOffset = 10;
    component.isRtl = true;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ start: 0, duration: 0 });
    await component.scrollbar.scrollTo({ end: 10, duration: 50 });
    expect(onScrollReachedSpy).toHaveBeenCalledWith('end');
  });


  it('[reachDisabled]: should not emit when scroll is reached destination', async () => {
    component.disabled = true;
    fixture.detectChanges();
    await component.scrollbar.scrollTo({ top: 0, duration: 0 });
    await component.scrollbar.scrollTo({ bottom: 0, duration: 50 });
    expect(onScrollReachedSpy).not.toHaveBeenCalledWith('bottom');
  });
});
