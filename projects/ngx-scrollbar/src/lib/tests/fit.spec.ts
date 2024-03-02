import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
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
  });

  let scrollbarOffset: number = 8;

  it('should fit both _scrollbars only if both of them are displayed', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackYElement: HTMLElement = component._scrollbars.y.track.nativeElement;
    const trackXElement: Element = component._scrollbars.x.track.nativeElement;

    const stickyYElement: Element = component._scrollbars.y.sticky.nativeElement;
    const stickyXElement: Element = component._scrollbars.x.sticky.nativeElement;

    expect(trackXElement.clientWidth).toBe(200 - stickyYElement.clientWidth - scrollbarOffset);
    expect(trackYElement.clientHeight).toBe(200 - stickyXElement.clientHeight - scrollbarOffset);
  });

  it('should not fit vertical scrollbar if horizontal is not displayed', async () => {
    setDimensions(component, { cmpHeight: 200, contentHeight: 500, cmpWidth: 200, contentWidth: 200 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackYElement: Element = component._scrollbars.y.track.nativeElement;
    expect(trackYElement.clientHeight).toBe(200 - scrollbarOffset);
  });

  it('should not fit horizontal scrollbar if vertical is not displayed', async () => {
    setDimensions(component, { cmpWidth: 200, contentWidth: 500, cmpHeight: 200, contentHeight: 200 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const trackXElement: Element = component._scrollbars.x.track.nativeElement;
    expect(trackXElement.clientWidth).toBe(200 - scrollbarOffset);
  });
});

