import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';

import { NgScrollbar } from './ng-scrollbar';
import { ScrollView } from './scroll-viewport';
import { Scrollbar } from './scrollbar-control/scrollbar-control';
import { SmoothScrollManager } from './smooth-scroll/smooth-scroll-manager';

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
        Scrollbar,
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

  it('should initialize component', () => {
    // spyOn<any>(component, 'updateOnChangeDetection');
    spyOn<any>(component, 'updateOnBreakpointsChanges');
    // spyOn<any>(component, 'updateOnWindowSizeChanges');
    component.ngOnInit();
    expect(component.view).toBeDefined();
    expect(component.scrolled).toBeDefined();
    expect(component.verticalScrolled).toBeDefined();
    expect(component.horizontalScrolled).toBeDefined();
    // expect(component['updateOnChangeDetection']).toHaveBeenCalled();
    expect(component['updateOnBreakpointsChanges']).toHaveBeenCalled();
    // expect(component['updateOnWindowSizeChanges']).toHaveBeenCalled();
  });

  // it('should update state on ngAfterViewChecked', () => {
  //   const updateSpy = spyOn<any>(component.updateObserver, 'next');
  //   component.ngAfterViewChecked();
  //   expect(updateSpy).toHaveBeenCalled();
  // });

  it('should clean up all observables on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component['destroyed'].isStopped).toBeTruthy();
  });

  /**
   * NgScrollbar Disabled Test
   */

  it('should be disabled when disabled = true', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(component.disabled).toBeTruthy();
    expect(componentElement.getAttribute('disabled')).toBe('true');
  });

  it('should be enabled when disabled = false', () => {
    component.disabled = false;
    fixture.detectChanges();
    expect(component.disabled).toBeFalsy();
    expect(componentElement.getAttribute('disabled')).toBe('false');
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
    component.direction = 'vertical';
    component.visibility = 'native';
    component.view.style.height = '300px';
    component.view.innerHTML = '<div style="height: 1000px"></div>';
    fixture.detectChanges();

    expect(component.useVerticalScrollbar).toBeTruthy();
    expect(component.isVerticalScrollbarScrollable).toBeTruthy();
    expect(component.useHorizontalScrollbar).toBeFalsy();
    expect(component.isHorizontalScrollbarScrollable).toBeFalsy();
  });

  it('should use vertical scrollbar if [visiblity]="\'always\'" event if viewport is not scrollable', () => {
    component.direction = 'vertical';
    component.visibility = 'always';
    component.view.style.height = '1000px';
    component.view.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();

    expect(component.useVerticalScrollbar).toBeTruthy();
    expect(component.isVerticalScrollbarScrollable).toBeFalsy();
    expect(component.useHorizontalScrollbar).toBeFalsy();
    expect(component.isHorizontalScrollbarScrollable).toBeFalsy();
  });

  it('should not use vertical scrollbar if viewport is not scrollable', () => {
    component.direction = 'vertical';
    component.visibility = 'native';
    component.view.style.height = '1000px';
    component.view.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();

    expect(component.useVerticalScrollbar).toBeFalsy();
    expect(component.isVerticalScrollbarScrollable).toBeFalsy();
    expect(component.useHorizontalScrollbar).toBeFalsy();
    expect(component.isHorizontalScrollbarScrollable).toBeFalsy();
  });

  it('should use horizontal scrollbar', () => {
    component.direction = 'horizontal';
    component.visibility = 'always';
    component.view.style.width = '300px';
    component.view.innerHTML = '<div style="width: 1000px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.useHorizontalScrollbar).toBeTruthy();
    expect(component.isHorizontalScrollbarScrollable).toBeTruthy();
    expect(component.useVerticalScrollbar).toBeFalsy();
    expect(component.isVerticalScrollbarScrollable).toBeFalsy();
  });


  it('should use horizontal scrollbar if [visiblity]="\'always\'" event if viewport is not scrollable', () => {
    component.direction = 'horizontal';
    component.visibility = 'always';
    component.view.style.width = '1000px';
    component.view.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.useHorizontalScrollbar).toBeTruthy();
    expect(component.isHorizontalScrollbarScrollable).toBeFalsy();
    expect(component.useVerticalScrollbar).toBeFalsy();
    expect(component.isVerticalScrollbarScrollable).toBeFalsy();
  });

  it('should not use horizontal scrollbar if viewport is not scrollable', () => {
    component.direction = 'horizontal';
    component.visibility = 'native';
    component.view.style.width = '1000px';
    component.view.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.useHorizontalScrollbar).toBeFalsy();
    expect(component.isHorizontalScrollbarScrollable).toBeFalsy();
    expect(component.useVerticalScrollbar).toBeFalsy();
    expect(component.isVerticalScrollbarScrollable).toBeFalsy();
  });

});
