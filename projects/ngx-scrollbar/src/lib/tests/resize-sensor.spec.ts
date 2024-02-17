import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';


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

  it('[Resize] should update when component size changes', (done: DoneFn) => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    component.appearance = 'compact';
    component.ngOnInit();
    component.ngAfterViewInit();

    component.afterUpdate.subscribe(() => {
      expect(component.viewportDimension()).toEqual({
        offsetWidth: 200,
        offsetHeight: 200,
        contentWidth: 400,
        contentHeight: 400
      });
      done();
    });

    // Change component size
    setTimeout(() => {
      setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });
    }, 20);
  });

  it('[Resize] should update when content size changes', (done: DoneFn) => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    component.appearance = 'compact';
    component.ngOnInit();
    component.ngAfterViewInit();

    component.afterUpdate.subscribe(() => {
      expect(component.viewportDimension()).toEqual({
        offsetWidth: 100,
        offsetHeight: 100,
        contentWidth: 500,
        contentHeight: 500
      });
      done();
    });

    // Change content size
    setTimeout(() => {
      setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 500, contentWidth: 500 });
    }, 20);
  });

  it('[Init] should call update afterViewInit and disable the resize sensor when "disableSensor" is used', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 400, contentWidth: 400 });
    component.disableSensor = signal(true) as any;
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
