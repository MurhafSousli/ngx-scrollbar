import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ResizeSensor } from './resize-sensor.directive';
import { NgScrollbar } from '../ng-scrollbar';
import { ScrollViewport } from '../scroll-viewport';
import { NgAttr } from '../utils/ng-attr.directive';
import { HideNativeScrollbar } from '../hide-native-scrollbar/hide-native-scrollbar';
import { ScrollbarX, ScrollbarY } from '../scrollbar/scrollbar.component';

@Component({
  template: `
    <ng-scrollbar style="width: 200px; height: 200px">
      <div style="width: 300px; height: 300px"></div>
    </ng-scrollbar>
  `
})
class TestResizeSensorComponent {
  @ViewChild(NgScrollbar, { static: true }) scrollable: NgScrollbar;
}

describe('Resize Observer Directive', () => {
  let component: TestResizeSensorComponent;
  let directiveElement: DebugElement;
  let directiveInstance: ResizeSensor;
  let fixture: ComponentFixture<TestResizeSensorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        NgScrollbar,
        NgAttr,
        HideNativeScrollbar,
        ResizeSensor,
        ScrollbarY,
        ScrollbarX,
        ScrollViewport,
        TestResizeSensorComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestResizeSensorComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(ResizeSensor));
    directiveInstance = directiveElement.injector.get(ResizeSensor);
    fixture.detectChanges();
  }));

  it('should create resize sensor directive', () => {
    expect(directiveInstance).toBeDefined();
  });

  it('should emits with ng-scrollbar size is changed', (done: DoneFn) => {

    directiveInstance.event.subscribe((e) => {
      expect(e).toBeTruthy();
      done();
    });
    component.scrollable.nativeElement.style.height = '100px';
  });

  it('should emits with content size is changed', (done: DoneFn) => {

    directiveInstance.event.subscribe((e) => {
      expect(e).toBeTruthy();
      done();
    });
    component.scrollable.viewport.contentWrapperElement.innerHTML = '<div style="width: 300px; height: 400px"></div>';
  });
});
