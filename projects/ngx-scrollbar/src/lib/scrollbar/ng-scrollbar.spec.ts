import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';

import { NgScrollbar, NgScrollbarState } from './ng-scrollbar';
import { ScrollView } from './scroll-view';
import { NgCustomScrollbar } from './scrollbars/ng-custom-scrollbar';
import { SmoothScrollManager } from '../smooth-scroll/smooth-scroll-manager';

describe('NgScrollbar Component', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;
  let componentElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ObserversModule,
        LayoutModule,
        BidiModule
      ],
      declarations: [
        NgScrollbar,
        NgCustomScrollbar,
        ScrollView
      ],
      providers: [
        SmoothScrollManager
      ]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    componentElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * NgScrollbar Disabled Test
   */

  it('should be disabled when disable() function is called', () => {
    component.disable();
    fixture.detectChanges();
    expect(component.disabled).toBeTruthy();
    expect(componentElement.getAttribute('disabled')).toBe('true');
  });

  it('should be enabled when enable() function is called', () => {
    component.disable();
    fixture.detectChanges();
    expect(component.disabled).toBeTruthy();
    expect(componentElement.getAttribute('disabled')).toBe('true');
  });

  it('should enable/disable when disabled input value is changed', () => {
    // [disabled]="true"
    component.disabled = true;
    fixture.detectChanges();
    expect(component.disabled).toBeTruthy();
    expect(componentElement.getAttribute('disabled')).toBe('true');

    // [disabled]="false"
    component.disabled = false;
    fixture.detectChanges();
    expect(component.disabled).toBeFalsy();
    expect(componentElement.getAttribute('disabled')).toBe('false');
  });


  /**
   * NgScrollbar State Test
   */

  it('should use vertical scrollbar when viewport is scrollable"', () => {
    component.state.subscribe((state: NgScrollbarState) => {
      expect(state).toEqual({
        useVerticalScrollbar: true,
        isVerticalScrollbarScrollable: true,
        useHorizontalScrollbar: undefined,
        isHorizontalScrollbarScrollable: undefined
      });
    });
    component.direction = 'vertical';
    component.visibility = 'native';
    component.view.style.height = '300px';
    component.view.innerHTML = '<div style="height: 1000px"></div>';
    fixture.detectChanges();
  });

  it('should use vertical scrollbar if [visiblity]="\'always\'" event if viewport is not scrollable', () => {
    component.state.subscribe((state: NgScrollbarState) => {
      expect(state).toEqual({
        useVerticalScrollbar: true,
        isVerticalScrollbarScrollable: false,
        useHorizontalScrollbar: undefined,
        isHorizontalScrollbarScrollable: undefined
      });
    });
    component.direction = 'vertical';
    component.visibility = 'always';
    component.view.style.height = '1000px';
    component.view.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();
  });

  it('should not use vertical scrollbar if viewport is not scrollable', () => {
    component.state.subscribe((state: NgScrollbarState) => {
      expect(state).toEqual({
        useVerticalScrollbar: false,
        isVerticalScrollbarScrollable: false,
        useHorizontalScrollbar: undefined,
        isHorizontalScrollbarScrollable: undefined
      });
    });
    component.direction = 'vertical';
    component.visibility = 'native';
    component.view.style.height = '1000px';
    component.view.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();
  });

  it('should use horizontal scrollbar', () => {
    component.state.subscribe((state: NgScrollbarState) => {
      expect(state).toEqual({
        useHorizontalScrollbar: true,
        isHorizontalScrollbarScrollable: true,
        useVerticalScrollbar: undefined,
        isVerticalScrollbarScrollable: undefined
      });
    });
    component.direction = 'horizontal';
    component.visibility = 'always';
    component.view.style.width = '300px';
    component.view.innerHTML = '<div style="width: 1000px; height: 300px"></div>';
    fixture.detectChanges();
  });


  it('should use horizontal scrollbar if [visiblity]="\'always\'" event if viewport is not scrollable', () => {
    component.state.subscribe((state: NgScrollbarState) => {
      expect(state).toEqual({
        useHorizontalScrollbar: true,
        isHorizontalScrollbarScrollable: false,
        useVerticalScrollbar: undefined,
        isVerticalScrollbarScrollable: undefined,
      });
    });
    component.direction = 'horizontal';
    component.visibility = 'always';
    component.view.style.width = '1000px';
    component.view.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();
  });

  it('should not use horizontal scrollbar if viewport is not scrollable', () => {
    component.state.subscribe((state: NgScrollbarState) => {
      expect(state).toEqual({
        useHorizontalScrollbar: false,
        isHorizontalScrollbarScrollable: false,
        useVerticalScrollbar: undefined,
        isVerticalScrollbarScrollable: undefined,
      });
    });
    component.direction = 'horizontal';
    component.visibility = 'native';
    component.view.style.width = '1000px';
    component.view.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();
  });

  it('should initialize component', () => {
    spyOn<any>(component, 'updateOnChangeDetection');
    spyOn<any>(component, 'updateOnBreakpointsChanges');
    spyOn<any>(component, 'updateOnWindowSizeChanges');
    component.ngOnInit();
    expect(component.view).toBeDefined();
    expect(component.scrolled).toBeDefined();
    expect(component.verticalScrolled).toBeDefined();
    expect(component.horizontalScrolled).toBeDefined();
    expect(component['updateOnChangeDetection']).toHaveBeenCalled();
    expect(component['updateOnBreakpointsChanges']).toHaveBeenCalled();
    expect(component['updateOnWindowSizeChanges']).toHaveBeenCalled();
  });

  it('should update state on ngAfterContentChecked', () => {
    const detectChangesSpy = spyOn<any>(component['detectChanges'], 'next');
    component.ngAfterContentChecked();
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  // it('should clean up all observables on ngOnDestroy', () => {
  //   component.ngOnDestroy();
  //   expect(component['destroyed'].closed).toBeTruthy();
  // });
});
