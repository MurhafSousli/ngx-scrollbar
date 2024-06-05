import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { afterTimeout, setDimensions } from './common-test.';


describe('Resize Sensor', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('[Init] should update as soon as it gets initialized', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);
    expect(component.disableSensor()).toEqual(false);
    expect(component['sizeChangeSub'].closed).toEqual(false);
    expect(component.viewportDimension()).toEqual({
      offsetWidth: 200,
      offsetHeight: 200,
      contentWidth: 500,
      contentHeight: 500
    });
  });

  it('[Resize] should update when component size changes', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    component.appearance = 'compact';
    component.ngOnInit();
    component.ngAfterViewInit();

    await afterTimeout(16);

    // Change component size
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });

    await firstValueFrom(component.afterUpdate);

    expect(component.viewportDimension()).toEqual({
      offsetWidth: 200,
      offsetHeight: 200,
      contentWidth: 400,
      contentHeight: 400
    });
  });

  it('[Resize] should update when content size changes', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    component.appearance = 'compact';
    component.ngOnInit();
    component.ngAfterViewInit();

    await afterTimeout(16);

    // Change content size
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 500, contentWidth: 500 });

    await firstValueFrom(component.afterUpdate);

    expect(component.viewportDimension()).toEqual({
      offsetWidth: 100,
      offsetHeight: 100,
      contentWidth: 500,
      contentHeight: 500
    });
  });

  it('[Resize + sensorThrottleTime] should throttle sensor', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    component.appearance = 'compact';
    fixture.componentRef.setInput('sensorThrottleTime', 200);
    component.ngOnInit();
    component.ngAfterViewInit();

    await afterTimeout(16);

    // Change content size
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 500, contentWidth: 500 });

    // Wait for 200ms
    await afterTimeout(100);

    // Verify viewport dimension haven't been updated
    expect(component.viewportDimension()).toEqual({
      offsetWidth: 100,
      offsetHeight: 100,
      contentWidth: 400,
      contentHeight: 400
    });

    // Wait for another 200ms
    await afterTimeout(100);

    // Verify that viewport been updated
    expect(component.viewportDimension()).toEqual({
      offsetWidth: 100,
      offsetHeight: 100,
      contentWidth: 500,
      contentHeight: 500
    });
  });

  it('[Init] should call update afterViewInit and disable the resize sensor when "disableSensor" is used', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('disableSensor', true);
    component.ngOnInit();
    component.ngAfterViewInit();

    await firstValueFrom(component.afterInit);
    expect(component.disableSensor()).toEqual(true);
    expect(component['sizeChangeSub'].closed).toEqual(true);
    expect(component.viewportDimension()).toEqual({
      offsetWidth: 100,
      offsetHeight: 100,
      contentWidth: 400,
      contentHeight: 400
    });
  });
});
