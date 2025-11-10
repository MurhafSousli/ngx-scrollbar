import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';

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
    const styles: CSSStyleDeclaration = getComputedStyle(component.adapter.contentWrapperElement);
    expect(styles.display).toBe('flow-root');
    expect(styles.minWidth).toBe('100%');
    expect(styles.minHeight).toBe('100%');
    // expect(styles.contain).toBe('content');
  });
});
