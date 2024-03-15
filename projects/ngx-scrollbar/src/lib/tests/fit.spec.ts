import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';

describe('Fit styles', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  const directionalityMock = {
    value: 'ltr',
    change: new BehaviorSubject<string>('ltr'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: Directionality, useValue: directionalityMock }
      ]
    }).compileComponents();
    directionalityMock.value = 'ltr';
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;

    // Set scrollbar offset value
    component.nativeElement.style.setProperty('--scrollbar-offset', '4');
  });

  const scrollbarOffset: number = 8;

  it('should fit both _scrollbars only if both of them are displayed', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-track')).nativeElement;
    const trackXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-track')).nativeElement;

    const stickyYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-sticky')).nativeElement;
    const stickyXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-sticky')).nativeElement;

    expect(trackXElement.clientWidth).toBe(200 - stickyYElement.clientWidth - scrollbarOffset);
    expect(trackYElement.clientHeight).toBe(200 - stickyXElement.clientHeight - scrollbarOffset);
  });

  it('should not fit vertical scrollbar if horizontal is not displayed', async () => {
    setDimensions(component, { cmpHeight: 200, contentHeight: 500, cmpWidth: 200, contentWidth: 200 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-track')).nativeElement;

    expect(trackYElement.clientHeight).toBe(200 - scrollbarOffset);
  });

  it('should not fit horizontal scrollbar if vertical is not displayed', async () => {
    setDimensions(component, { cmpWidth: 200, contentWidth: 500, cmpHeight: 200, contentHeight: 200 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-track')).nativeElement;
    expect(trackXElement.clientWidth).toBe(200 - scrollbarOffset);
  });
});

