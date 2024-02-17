import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NgScrollbar, ScrollbarOrientation, ScrollbarVisibility } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { setDimensions } from './common-test.';

describe('NgScrollbar Component', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create <ng-scrollbar> component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and viewport', () => {
    component.ngOnInit();
    expect(component).toBeDefined();
    expect(component.viewport).toBeDefined();
  });


  it('should emit afterUpdate after update function is called', () => {
    const afterUpdateEmitSpy: jasmine.Spy = spyOn(component.afterUpdate, 'emit');
    component.ngOnInit();
    component.ngAfterViewInit();
    component.update();
    expect(afterUpdateEmitSpy).toHaveBeenCalled();
  });


  it('should show vertical scrollbar when viewport is scrollable', async () => {
    component.orientation = signal<ScrollbarOrientation>('vertical') as any;
    component.visibility = signal<ScrollbarVisibility>('native') as any;
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);

    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeTrue();
    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
  });

  it('should show vertical scrollbar if visibility="always" even if viewport is not scrollable', async () => {
    component.orientation = signal<ScrollbarOrientation>('vertical') as any;
    component.visibility = signal<ScrollbarVisibility>('always') as any;
    setDimensions(component, { cmpHeight: 1000, contentHeight: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);

    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeFalse();
    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
  });

  it('should not show vertical scrollbar when viewport is not scrollable', () => {
    component.orientation = signal<ScrollbarOrientation>('vertical') as any;
    component.visibility = signal<ScrollbarVisibility>('native') as any;
    setDimensions(component, { cmpWidth: 1000, cmpHeight: 1000, contentHeight: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();

    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
  });

  it('should show horizontal scrollbar if viewport is horizontally scrollable', async () => {
    component.orientation = signal<ScrollbarOrientation>('horizontal') as any;
    component.visibility = signal<ScrollbarVisibility>('always') as any;
    setDimensions(component, { cmpWidth: 300, contentHeight: 300, contentWidth: 1000 });
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeTrue();
    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });


  it('should show horizontal scrollbar if visibility="always" even if viewport is not scrollable', async () => {
    component.orientation = signal<ScrollbarOrientation>('horizontal') as any;
    component.visibility = signal<ScrollbarVisibility>('always') as any;
    setDimensions(component, { cmpWidth: 1000, contentHeight: 300, contentWidth: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeFalse();
    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });

  it('should not show horizontal scrollbar if viewport is not scrollable', () => {
    component.orientation = signal<ScrollbarOrientation>('horizontal') as any;
    component.visibility = signal<ScrollbarVisibility>('native') as any;
    setDimensions(component, { cmpWidth: 1000, contentHeight: 300, contentWidth: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();

    expect(component.horizontalUsed()).toBeFalse();
    expect(component.isHorizontallyScrollable()).toBeFalse();
    expect(component.verticalUsed()).toBeFalse();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });

  it('should show all scrollbars if visibility="always"', async () => {
    component.orientation = signal<ScrollbarOrientation>('auto') as any;
    component.visibility = signal<ScrollbarVisibility>('always') as any;
    setDimensions(component, { cmpWidth: 1000, cmpHeight: 1000, contentHeight: 300, contentWidth: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeFalse();
    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeFalse();
  });

  it('should show all scrollbars if viewport is vertically and horizontally scrollable', async () => {
    component.orientation = signal<ScrollbarOrientation>('auto') as any;
    component.visibility = signal<ScrollbarVisibility>('always') as any;
    setDimensions(component, { cmpWidth: 200, cmpHeight: 200, contentHeight: 300, contentWidth: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);

    expect(component.horizontalUsed()).toBeTrue();
    expect(component.isHorizontallyScrollable()).toBeTrue();
    expect(component.verticalUsed()).toBeTrue();
    expect(component.isVerticallyScrollable()).toBeTrue();
  });

  it('[Auto-height]: component height and width should match content size by default', () => {
    component.orientation = signal<ScrollbarOrientation>('auto') as any;
    component.appearance = 'standard';
    setDimensions(component, { contentHeight: 300, contentWidth: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();

    expect(component.scrollbars.y).toBeFalsy();
    expect(component.verticalUsed()).toBeFalsy();
    expect(component.scrollbars.x).toBeFalsy();
    expect(component.horizontalUsed()).toBeFalsy();
    expect(getComputedStyle(component.nativeElement).height).toBe('300px');
  });
});

