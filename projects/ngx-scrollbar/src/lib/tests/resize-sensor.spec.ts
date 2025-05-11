import { ComponentFixture, TestBed } from '@angular/core/testing';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { afterTimeout, setDimensions } from './common-test.';


describe('Resize Sensor', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);
    fixture.detectChanges();
  });

  it('[Init] should update as soon as it gets initialized', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });

    await firstValueFrom(outputToObservable(adapter.afterInit));
    expect(adapter.disableSensor()).toEqual(false);

    expect(adapter.viewportDimension()).toEqual({
      width: 200,
      height: 200
    });
    expect(adapter.contentDimension()).toEqual({
      width: 500,
      height: 500
    });
  });

  it('[Resize] should update when component size changes', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('appearance', 'compact');

    await afterTimeout(16);

    // Change component size
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });

    await firstValueFrom(outputToObservable(adapter.afterUpdate));

    expect(adapter.viewportDimension()).toEqual({
      width: 200,
      height: 200
    });
    expect(adapter.contentDimension()).toEqual({
      width: 400,
      height: 400
    });
  });

  it('[Resize] should update when content size changes', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('appearance', 'compact');

    await afterTimeout(16);

    // Change content size
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 500, contentWidth: 500 });

    await firstValueFrom(outputToObservable(adapter.afterUpdate));

    expect(adapter.viewportDimension()).toEqual({
      width: 100,
      height: 100
    });
    expect(adapter.contentDimension()).toEqual({
      width: 500,
      height: 500
    });
  });

  it('[Resize + sensorThrottleTime] should throttle sensor', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('appearance', 'compact');
    fixture.componentRef.setInput('sensorThrottleTime', 200);

    await firstValueFrom(outputToObservable(adapter.afterInit));

    // Change content size
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 500, contentWidth: 500 });

    // Wait for 200ms
    await afterTimeout(100);

    // Verify viewport dimension haven't been updated
    expect(adapter.viewportDimension()).toEqual({
      width: 100,
      height: 100
    });
    expect(adapter.contentDimension()).toEqual({
      width: 400,
      height: 400
    });

    // Wait for another 200ms
    await afterTimeout(100);

    // Verify that viewport been updated
    expect(adapter.viewportDimension()).toEqual({
      width: 100,
      height: 100
    });
    expect(adapter.contentDimension()).toEqual({
      width: 500,
      height: 500
    });
  });

  it('[Init] should call update afterViewInit and disable the resize sensor when "disableSensor" is used', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('disableSensor', true);

    await firstValueFrom(outputToObservable(adapter.afterInit))
    expect(adapter.disableSensor()).toEqual(true);
    expect(adapter.viewportDimension()).toEqual({
      width: 100,
      height: 100
    });
    expect(adapter.contentDimension()).toEqual({
      width: 400,
      height: 400
    });
  });
});
