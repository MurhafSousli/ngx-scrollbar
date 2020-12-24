import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BidiModule } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { PlatformModule } from '@angular/cdk/platform';
import { SmoothScrollModule } from '../../smooth-scroll/src/smooth-scroll.module';

import { NgScrollbar } from './ng-scrollbar';
import { ScrollViewport } from './scroll-viewport';
import { NgAttr } from './utils/ng-attr.directive';
import { ResizeSensor } from './resize-sensor/resize-sensor.directive';
import { HideNativeScrollbar } from './hide-native-scrollbar/hide-native-scrollbar';
import { ScrollbarX, ScrollbarY } from './scrollbar/scrollbar.component';

describe('NgScrollbar Component', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;
  let componentElement: HTMLElement;

  beforeEach(() => {
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
  });


  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    componentElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
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
    const updateSpy = spyOn<any>(component, 'updateState');
    component.ngAfterViewChecked();
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should clean up all observables on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component['destroyed'].isStopped).toBeTrue();
  });

  /**
   * NgScrollbar State Test
   */

  it('should show vertical scrollbar when viewport is scrollable"', () => {
    component.track = 'vertical';
    component.visibility = 'native';
    component.viewport.nativeElement.style.height = '300px';
    component.viewport.nativeElement.innerHTML = '<div style="height: 1000px"></div>';
    fixture.detectChanges();

    expect(component.state.verticalUsed).toBeTrue();
    expect(component.state.isVerticallyScrollable).toBeTrue();
    expect(component.state.horizontalUsed).toBeFalse();
    expect(component.state.isHorizontallyScrollable).toBeFalse();

    expect(component['scrollbarY']).toBeTruthy();
    expect(component['scrollbarX']).toBeFalsy();
  });

  it('should show vertical scrollbar if visiblity="always" even if viewport is not scrollable', () => {
    component.track = 'vertical';
    component.visibility = 'always';
    component.viewport.nativeElement.style.height = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.verticalUsed).toBeTrue();
    expect(component.state.isVerticallyScrollable).toBeFalse();
    expect(component.state.horizontalUsed).toBeFalse();
    expect(component.state.isHorizontallyScrollable).toBeFalse();

    expect(component['scrollbarY']).toBeTruthy();
    expect(component['scrollbarX']).toBeFalsy();
  });

  it('should not show vertical scrollbar if viewport is not scrollable', () => {
    component.track = 'vertical';
    component.visibility = 'native';
    component.viewport.nativeElement.style.height = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.verticalUsed).toBeFalse();
    expect(component.state.isVerticallyScrollable).toBeFalse();
    expect(component.state.horizontalUsed).toBeFalse();
    expect(component.state.isHorizontallyScrollable).toBeFalse();

    expect(component['scrollbarY']).toBeFalsy();
    expect(component['scrollbarX']).toBeFalsy();
  });

  it('should show horizontal scrollbar', () => {
    component.track = 'horizontal';
    component.visibility = 'always';
    component.viewport.nativeElement.style.width = '300px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 1000px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeTrue();
    expect(component.state.isHorizontallyScrollable).toBeTrue();
    expect(component.state.verticalUsed).toBeFalse();
    expect(component.state.isVerticallyScrollable).toBeFalse();

    expect(component['scrollbarY']).toBeFalsy();
    expect(component['scrollbarX']).toBeTruthy();
  });


  it('should show horizontal scrollbar if visiblity="always" even if viewport is not scrollable', () => {
    component.track = 'horizontal';
    component.visibility = 'always';
    component.viewport.nativeElement.style.width = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeTrue();
    expect(component.state.isHorizontallyScrollable).toBeFalse();
    expect(component.state.verticalUsed).toBeFalse();
    expect(component.state.isVerticallyScrollable).toBeFalse();

    expect(component['scrollbarY']).toBeFalsy();
    expect(component['scrollbarX']).toBeTruthy();
  });

  it('should not show horizontal scrollbar if viewport is not scrollable', () => {
    component.track = 'horizontal';
    component.visibility = 'native';
    component.viewport.nativeElement.style.width = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeFalse();
    expect(component.state.isHorizontallyScrollable).toBeFalse();
    expect(component.state.verticalUsed).toBeFalse();
    expect(component.state.isVerticallyScrollable).toBeFalse();

    expect(component['scrollbarY']).toBeFalsy();
    expect(component['scrollbarX']).toBeFalsy();
  });

  it('should show all scrollbars if visiblity="always"', () => {
    component.track = 'all';
    component.visibility = 'always';
    component.viewport.nativeElement.style.width = '1000px';
    component.viewport.nativeElement.style.height = '1000px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeTrue();
    expect(component.state.isHorizontallyScrollable).toBeFalse();
    expect(component.state.verticalUsed).toBeTrue();
    expect(component.state.isVerticallyScrollable).toBeFalse();

    expect(component['scrollbarY']).toBeTruthy();
    expect(component['scrollbarX']).toBeTruthy();
  });

  it('should show all scrollbars if viewport is vertically and horizontally scrollable', () => {
    component.track = 'all';
    component.visibility = 'native';
    component.viewport.nativeElement.style.width = '200px';
    component.viewport.nativeElement.style.height = '200px';
    component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    fixture.detectChanges();

    expect(component.state.horizontalUsed).toBeTrue();
    expect(component.state.isHorizontallyScrollable).toBeTrue();
    expect(component.state.verticalUsed).toBeTrue();
    expect(component.state.isVerticallyScrollable).toBeTrue();

    expect(component['scrollbarY']).toBeTruthy();
    expect(component['scrollbarX']).toBeTruthy();
  });

  it('[Auto-height]: component height should match content height', () => {
    component.autoHeightDisabled = false;
    component.track = 'all';
    component.appearance = 'standard';
    component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
    component.ngOnInit();
    component.ngAfterViewChecked();
    fixture.detectChanges();

    expect(component['scrollbarY']).toBeFalsy();
    expect(component['scrollbarX']).toBeFalsy();
    expect(window.getComputedStyle(component.nativeElement).height).toBe('300px');
  });

  // it('[Auto-height]: component height should match content height when horizontally scrollable', () => {
  //   component.autoHeightDisabled = false;
  //   component.track = 'all';
  //   component.appearance = 'standard';
  //   component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
  //   component.viewport.nativeElement.style.width = '200px';
  //   component.viewport.nativeElement.style.height = `${300 + component['scrollbarX']?.nativeElement.clientHeight}px`;
  //   component.ngOnInit();
  //   component.ngAfterViewChecked();
  //   fixture.detectChanges();
  //
  //   // expect(component['scrollbarY']).toBeFalsy();
  //   expect(component.state.verticalUsed).toBeFalsy();
  //   expect(component['scrollbarX']).toBeTruthy();
  //   expect(window.getComputedStyle(component.nativeElement).height).toBe(`${300 + component['scrollbarX']?.nativeElement.clientHeight}px`);
  // });

  // it('[Auto-width]: component width should match content width', () => {
  //   component.autoWidthDisabled = false;
  //   component.autoHeightDisabled = true;
  //   component.appearance = 'standard';
  //   component.track = 'all';
  //   component.viewport.nativeElement.innerHTML = '<div style="width: 300px; height: 300px"></div>';
  //   component.viewport.nativeElement.style.position = 'fixed';
  //   component.viewport.nativeElement.style.width = '300px';
  //
  //   component.ngAfterViewChecked();
  //   fixture.detectChanges();
  //
  //   expect(component['scrollbarY']).toBeFalsy();
  //   expect(component['scrollbarX']).toBeFalsy();
  //   console.log(window.getComputedStyle(component.nativeElement).width, window.getComputedStyle(component.viewport.nativeElement.firstElementChild).width);
  //   expect(window.getComputedStyle(component.nativeElement).width).toBe('300px');
  // });
});
