import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test';

describe('Content scrollbars styles', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
  });

  it('should have the default content styles', () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 50, contentHeight: 50 });
    expect(component.adapter.contentWrapperElement).toHaveStyle({
      display: 'flow-root',
      minWidth: '100%',
      minHeight: '100%'
    });
  });
});
