import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { NgScrollbar } from 'ngx-scrollbar';
import { ViewportClasses } from '../utils/common';
import { setDimensions } from './common-test.';

describe('Viewport Adapter', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;
  let viewportInitSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    viewportInitSpy = spyOn(component.viewport, 'init').and.callThrough();
  });

  it('should initialize viewport and add the proper classes to viewport and content wrapper', () => {
    expect(component.viewport).toBeDefined();

    expect(viewportInitSpy).toHaveBeenCalledOnceWith(component.nativeElement, component.contentWrapper().nativeElement);

    expect(component.viewport.nativeElement).toBeDefined();
    expect(component.viewport.contentWrapperElement).toBeDefined();

    expect(component.viewport.nativeElement.classList).toContain(ViewportClasses.Viewport);
    expect(component.viewport.contentWrapperElement.classList).toContain(ViewportClasses.Content);

    expect(component.viewport.initialized()).toBeTrue();
  });

  it('should instantly jump to scroll position when using scrollYTo and scrollXTo', () => {
    TestBed.flushEffects();
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 400, contentHeight: 400 });

    component.viewport.scrollYTo(200);
    expect(component.viewport.scrollTop).toBe(200);

    component.viewport.scrollXTo(300);
    expect(component.viewport.scrollLeft).toBe(300);
  });
});
