import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';

describe('Native scrollbars', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
  });

  it('should hide the native scrollbars by default', () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 200, contentHeight: 200 });

    const pseudoStyle: CSSStyleDeclaration = getComputedStyle(component.adapter.viewportElement, '::-webkit-scrollbar');
    const scrollbarDisplay: string = pseudoStyle.getPropertyValue('display');

    expect(scrollbarDisplay).toBe('none');
  });
});
