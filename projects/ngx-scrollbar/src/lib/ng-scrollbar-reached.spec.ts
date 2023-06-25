import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';


@Component({
  template: `
    <ng-scrollbar style="width: 100px; height: 100px"
                  (reachedTop)="onReached('top')"
                  (reachedBottom)="onReached('bottom')"
                  (reachedStart)="onReached('start')"
                  (reachedEnd)="onReached('end')"
                  [dir]="isRtl ? 'rtl' : 'ltr'">
      <div style="width: 300px; height: 300px"></div>
    </ng-scrollbar>
  `,
  standalone: true,
  imports: [BidiModule, NgScrollbarModule, NgScrollbarReachedModule]
})
class TestComponent {
  isRtl: boolean = false;

  @ViewChild(NgScrollbar, { static: true }) scrollbar: NgScrollbar;

  onReached(value: string): void {
    console.log(value);
  }
}

describe('Reached Events Directives', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let onReachedSpy;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    onReachedSpy = spyOn<any>(component, 'onReached');
  }));

  it('[ReachedTopEvent]: should emit (reachedTop)', async () => {
    await component.scrollbar.scrollTo({ bottom: 0, duration: 0 });
    await component.scrollbar.scrollTo({ top: 0, duration: 50 });
    expect(onReachedSpy).toHaveBeenCalledWith('top');
  });
  it('[ReachedBottomEvent]: should emit (reachedBottom)', async () => {
    await component.scrollbar.scrollTo({ top: 0, duration: 0 });
    await component.scrollbar.scrollTo({ bottom: 0, duration: 50 });
    expect(onReachedSpy).toHaveBeenCalledWith('bottom');
  });

  it('[ReachedStartEvent]: should emit (reachedStart)', async () => {
    component.isRtl = true;
    await component.scrollbar.scrollTo({ end: 0, duration: 0 });
    await component.scrollbar.scrollTo({ start: 0, duration: 50 });
    expect(onReachedSpy).toHaveBeenCalledWith('start');
  });
  it('[ReachedEndEvent]: should emit (reachedEnd)', async () => {
    await component.scrollbar.scrollTo({ start: 0, duration: 0 });
    await component.scrollbar.scrollTo({ end: 0, duration: 50 });
    expect(onReachedSpy).toHaveBeenCalledWith('end');
  });

  it('[ReachedStartEvent]: should emit (reachedStart) in RTL mode', async () => {
    component.isRtl = true;
    await component.scrollbar.scrollTo({ end: 0, duration: 0 });
    await component.scrollbar.scrollTo({ start: 0, duration: 50 });
    expect(onReachedSpy).toHaveBeenCalledWith('start');
  });
  it('[ReachedEndEvent]: should emit (reachedEnd) in RTL mode', async () => {
    component.isRtl = true;
    await component.scrollbar.scrollTo({ start: 0, duration: 0 });
    await component.scrollbar.scrollTo({ end: 0, duration: 50 });
    expect(onReachedSpy).toHaveBeenCalledWith('end');
  });
});
