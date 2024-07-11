import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';

describe('Hover effect', () => {
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
    component.nativeElement.style.setProperty('--scrollbar-thickness', '5');
    component.nativeElement.style.setProperty('--scrollbar-hover-thickness', '10');
    component.nativeElement.style.setProperty('--scrollbar-offset', '4');
  });

  it('Should activate hover effect only when mouse is over the scrollbar in case [hoverOffset]="false"', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('hoverOffset', false);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const stickyYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-sticky')).nativeElement;
    const stickyXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-sticky')).nativeElement;

    const trackYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-track-wrapper')).nativeElement;
    const trackXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-track-wrapper')).nativeElement;

    expect(stickyYElement.classList).not.toContain('ng-scrollbar-hover');
    expect(stickyXElement.classList).not.toContain('ng-scrollbar-hover');
    expect(trackYElement.classList).toContain('ng-scrollbar-hover');
    expect(trackXElement.classList).toContain('ng-scrollbar-hover');
  });

  it('Should activate hover effect when mouse is over the offset area in case [hoverOffset]="true"', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('hoverOffset', true);
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const stickyYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-sticky')).nativeElement;
    const stickyXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-sticky')).nativeElement;

    const trackYElement: Element = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-track-wrapper')).nativeElement;
    const trackXElement: Element = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-track-wrapper')).nativeElement;

    expect(stickyYElement.classList).toContain('ng-scrollbar-hover');
    expect(stickyXElement.classList).toContain('ng-scrollbar-hover');
    expect(trackYElement.classList).not.toContain('ng-scrollbar-hover');
    expect(trackXElement.classList).not.toContain('ng-scrollbar-hover');
  });
});

