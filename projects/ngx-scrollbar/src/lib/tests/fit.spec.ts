import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
import { By } from '@angular/platform-browser';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { DirectionalityMock, setDimensions } from './common-test';

describe('Fit styles', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Directionality, useValue: DirectionalityMock }
      ]
    }).compileComponents();
    DirectionalityMock.valueSignal.set('ltr');
    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);

    // Set scrollbar offset value
    component.nativeElement.style.setProperty('--scrollbar-container-offset', '4px');
  });

  const scrollbarOffset: number = 8;

  it('should fit both scrollbars only if both of them are displayed', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-track')).nativeElement;
    const trackXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-track')).nativeElement;

    const stickyYElement: Element = fixture.debugElement.query(By.css('scrollbar-y')).nativeElement;
    const stickyXElement: Element = fixture.debugElement.query(By.css('scrollbar-x')).nativeElement;

    expect(trackXElement.clientWidth).toBe(200 - stickyYElement.clientWidth - scrollbarOffset);
    expect(trackYElement.clientHeight).toBe(200 - stickyXElement.clientHeight - scrollbarOffset);
  });

  it('should not fit vertical scrollbar if horizontal is not displayed', async () => {
    setDimensions(component, { cmpHeight: 200, contentHeight: 500, cmpWidth: 200, contentWidth: 200 });
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-track')).nativeElement;

    expect(trackYElement.clientHeight).toBe(200 - scrollbarOffset);
  });

  it('should not fit horizontal scrollbar if vertical is not displayed', async () => {
    setDimensions(component, { cmpWidth: 200, contentWidth: 500, cmpHeight: 200, contentHeight: 200 });
    await firstValueFrom(outputToObservable(adapter.afterInit));
    fixture.detectChanges();

    const trackXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-track')).nativeElement;
    expect(trackXElement.clientWidth).toBe(200 - scrollbarOffset);
  });
});

