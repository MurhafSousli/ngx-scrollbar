import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgAttr } from './ng-attr.directive';
import { NgScrollbarState } from '../ng-scrollbar.model';

const testState: NgScrollbarState = {
  position: 'native',
  track: 'vertical',
  appearance: 'compact',
  visibility: 'native',
  deactivated: false,
  dir: 'ltr',
  pointerEventsMethod: 'viewport',
  verticalUsed: true,
  horizontalUsed: false,
  isVerticallyScrollable: true,
  isHorizontallyScrollable: false
};

@Component({
  template: `
    <div [ngAttr]="value"></div>`,
  standalone: true,
  imports: [NgAttr]
})
class TestComponent {
  @ViewChild(NgAttr, { static: true }) directive: NgAttr;
  value: NgScrollbarState = testState;
}

describe('NgAttr Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent, NgAttr]
    }).createComponent(TestComponent);

    directiveElement = fixture.debugElement.query(By.directive(NgAttr));
    fixture.detectChanges();
  }));

  it('should create hideNativeScrollbar directive', () => {
    expect(directiveElement).toBeDefined();
  });

  it('should set the attributes', () => {
    Object.entries(testState).forEach(([key, value]: [string, any]) => {
      expect((directiveElement.nativeElement as HTMLElement).getAttribute(key)).toBe(value.toString());
    });
  });
});
