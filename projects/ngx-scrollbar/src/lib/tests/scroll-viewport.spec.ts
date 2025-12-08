import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { NgScrollbar } from 'ngx-scrollbar';
import { ViewportClasses } from '../utils/common';
import { setDimensions } from './common-test.';

describe('Viewport Adapter', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;
  let viewportInitSpy;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    viewportInitSpy = vi.spyOn(component.adapter, 'init');
    fixture.detectChanges();
  });

  it('should initialize viewport and add the proper classes to viewport and content wrapper', () => {
    expect(component.adapter).toBeDefined();

    expect(viewportInitSpy).toHaveBeenCalledExactlyOnceWith(component.nativeElement, component.contentWrapperElement());

    expect(component.adapter.viewportElement).toBeDefined();
    expect(component.adapter.contentWrapperElement).toBeDefined();

    expect(component.adapter.viewportElement.classList).toContain(ViewportClasses.Viewport);
    expect(component.adapter.contentWrapperElement.classList).toContain(ViewportClasses.Content);

    expect(component.adapter.initialized()).toBe(true);
  });

  it('should instantly jump to scroll position when using scrollYTo and scrollXTo', () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 400 });

    component.adapter.scrollYTo(200);
    expect(component.adapter.scrollTop).toBe(200);

    component.adapter.scrollXTo(300);
    expect(component.adapter.scrollLeft).toBe(300);
  });
});
