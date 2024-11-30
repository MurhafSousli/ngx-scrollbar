import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollDropped } from 'ngx-scrollbar/reached-event';

@Component({
  template: `
    <ng-scrollbar style="width: 100px; height: 100px"
                  (droppedTop)="onScrollDropped('top')"
                  (droppedBottom)="onScrollDropped('bottom')"
                  (droppedStart)="onScrollDropped('start')"
                  (droppedEnd)="onScrollDropped('end')"
                  [droppedOffset]="offset"
                  [droppedTopOffset]="topOffset"
                  [droppedBottomOffset]="bottomOffset"
                  [droppedStartOffset]="startOffset"
                  [droppedEndOffset]="endOffset"
                  [disableDropped]="disabled"
                  [dir]="isRtl ? 'rtl' : 'ltr'">
      <div style="width: 300px; height: 300px"></div>
    </ng-scrollbar>
  `,
  imports: [BidiModule, NgScrollbarModule, NgScrollDropped]
})
class TestComponent {
  offset: number;
  topOffset: number;
  bottomOffset: number;
  startOffset: number;
  endOffset: number;
  isRtl: boolean = false;
  disabled: boolean = false;

  @ViewChild(NgScrollbar, { static: true }) scrollbar: NgScrollbar;

  onScrollDropped(value: string): void {
    console.log(value);
  }
}

describe('Dropped Events Directives', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let onScrollDroppedSpy: jasmine.Spy;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    onScrollDroppedSpy = spyOn(component, 'onScrollDropped');
  });

  it('[DroppedOffset]: should emit (droppedTop) (droppedBottom) (droppedStart) (droppedEnd)', async () => {
    component.offset = 10;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ top: 0, duration: 0 });
    await component.scrollbar.scrollTo({ top: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('top');
    await component.scrollbar.scrollTo({ bottom: 0, duration: 0 });
    await component.scrollbar.scrollTo({ bottom: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('bottom');
    await component.scrollbar.scrollTo({ end: 0, duration: 0 });
    await component.scrollbar.scrollTo({ end: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('end');
    await component.scrollbar.scrollTo({ start: 0, duration: 0 });
    await component.scrollbar.scrollTo({ start: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('start');
  });

  it('[DroppedTopEvent]: should emit (droppedTop)', async () => {
    component.topOffset = 10;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ top: 0, duration: 0 });
    await component.scrollbar.scrollTo({ top: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('top');
  });

  it('[DroppedBottomEvent]: should emit (droppedBottom)', async () => {
    component.bottomOffset = 10;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ bottom: 0, duration: 0 });
    await component.scrollbar.scrollTo({ bottom: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('bottom');
  });

  it('[DroppedStartEvent]: should emit (droppedStart)', async () => {
    component.startOffset = 10;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ start: 0, duration: 0 });
    await component.scrollbar.scrollTo({ start: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('start');
  });

  it('[DroppedEndEvent]: should emit (droppedEnd)', async () => {
    component.endOffset = 10;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ end: 0, duration: 0 });
    await component.scrollbar.scrollTo({ end: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('end');
  });

  it('[DroppedStartEvent]: should emit (droppedStart) in RTL mode', async () => {
    component.startOffset = 10;
    component.isRtl = true;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ start: 0, duration: 0 });
    await component.scrollbar.scrollTo({ start: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('start');
  });

  it('[DroppedEndEvent]: should emit (droppedEnd) in RTL mode', async () => {
    component.endOffset = 10;
    component.isRtl = true;
    fixture.detectChanges();

    await component.scrollbar.scrollTo({ end: 0, duration: 0 });
    await component.scrollbar.scrollTo({ end: 11, duration: 50 });
    expect(onScrollDroppedSpy).toHaveBeenCalledWith('end');
  });


  it('[reachDisabled]: should not emit when scroll is dropped destination', async () => {
    component.disabled = true;
    fixture.detectChanges();
    await component.scrollbar.scrollTo({ bottom: 0, duration: 0 });
    await component.scrollbar.scrollTo({ bottom: 11, duration: 50 });
    expect(onScrollDroppedSpy).not.toHaveBeenCalledWith('bottom');
  });
});
