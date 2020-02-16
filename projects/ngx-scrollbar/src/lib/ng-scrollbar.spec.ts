import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BidiModule } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { PlatformModule } from '@angular/cdk/platform';
import { SmoothScrollModule } from '../../smooth-scroll/src/smooth-scroll.module';

import { NgScrollbar } from './ng-scrollbar';
import { ScrollViewport } from './scroll-viewport';
import { NgAttr } from './utils/ng-attr.directive';
import { ResizeSensor } from './utils/resize-sensor.directive';
import { HideNativeScrollbar } from './utils/hide-native-scrollbar';
import { ScrollbarX, ScrollbarY } from './scrollbar/scrollbar.component';

describe('NgScrollbar Component', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;
  let componentElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BidiModule,
        PortalModule,
        PlatformModule,
        SmoothScrollModule
      ],
      declarations: [
        NgScrollbar,
        NgAttr,
        HideNativeScrollbar,
        ResizeSensor,
        ScrollbarY,
        ScrollbarX,
        ScrollViewport
      ]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    componentElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create <ng-scrollbar> component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    component.ngOnInit();
    expect(component.viewport).toBeDefined();
    expect(component.scrolled).toBeDefined();
    expect(component.verticalScrolled).toBeDefined();
    expect(component.horizontalScrolled).toBeDefined();
    expect(component.state).toBeDefined();
  });

  it('should update state on ngAfterViewChecked', () => {
  const updateStateSpy = spyOn<any>(component, 'updateState');
  component.ngAfterViewChecked();
  expect(updateStateSpy).toHaveBeenCalled();
  });

  it('should clean up all observables on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component['destroyed'].isStopped).toBeTruthy();
  });

  /**
   * NgScrollbar State Test
   */

  it('should use vertical scrollbar when viewport is scrollable"', () => {
    component.track = 'vertical';
    component.visibility = 'native';
    component.viewport.nativeElement.style.height = '300px';
    component.viewport.nativeElement.innerHTML = '<div style="height: 1000px"></div>';
    fixture.detectChanges();

    expect(component.state.verticalUsed).toBeTruthy();
    expect(component.state.isVerticallyScrollable).toBeTruthy();
    expect(component.state.horizontalUsed).toBeFalsy();
    expect(component.state.isHorizontallyScrollable).toBeFalsy();
  });

  it('should use vertical scrollbar if visiblity="always" event if viewport is not scrollable', () => {
    component.track = 'vertical';
    component.visibility = 'always';
    component.viewport.nativeElement.style.height = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.verticalUsed).toBeTruthy();
    expect(component.state.isVerticallyScrollable).toBeFalsy();
    expect(component.state.horizontalUsed).toBeFalsy();
    expect(component.state.isHorizontallyScrollable).toBeFalsy();
  });

  it('should not use vertical scrollbar if viewport is not scrollable', () => {
    component.track = 'vertical';
    component.visibility = 'native';
    component.viewport.nativeElement.style.height = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.verticalUsed).toBeFalsy();
    expect(component.state.isVerticallyScrollable).toBeFalsy();
    expect(component.state.horizontalUsed).toBeFalsy();
    expect(component.state.isHorizontallyScrollable).toBeFalsy();
  });

  it('should use horizontal scrollbar', () => {
    component.track = 'horizontal';
    component.visibility = 'always';
    component.viewport.nativeElement.style.width = '300px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 1000px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeTruthy();
    expect(component.state.isHorizontallyScrollable).toBeTruthy();
    expect(component.state.verticalUsed).toBeFalsy();
    expect(component.state.isVerticallyScrollable).toBeFalsy();
  });


  it('should use horizontal scrollbar if visiblity="always" event if viewport is not scrollable', () => {
    component.track = 'horizontal';
    component.visibility = 'always';
    component.viewport.nativeElement.style.width = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeTruthy();
    expect(component.state.isHorizontallyScrollable).toBeFalsy();
    expect(component.state.verticalUsed).toBeFalsy();
    expect(component.state.isVerticallyScrollable).toBeFalsy();
  });

  it('should not use horizontal scrollbar if viewport is not scrollable', () => {
    component.track = 'horizontal';
    component.visibility = 'native';
    component.viewport.nativeElement.style.width = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeFalsy();
    expect(component.state.isHorizontallyScrollable).toBeFalsy();
    expect(component.state.verticalUsed).toBeFalsy();
    expect(component.state.isVerticallyScrollable).toBeFalsy();
  });

});
