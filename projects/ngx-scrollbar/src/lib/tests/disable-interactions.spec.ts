import { NgScrollbar } from 'ngx-scrollbar';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { setDimensions } from './common-test.';

describe('disableInteraction option', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  let interactionSubscriptionXSpy: jasmine.Spy;
  let interactionSubscriptionYSpy: jasmine.Spy;

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

  function interactionEnabledCases(): void {
    expect(component.disableInteraction()).toBeFalse();
    expect(component.nativeElement.getAttribute('disableInteraction')).toBe('false');

    expect(component._scrollbars.x._pointerEventsSub.closed).toBeFalse();
    expect(component._scrollbars.y._pointerEventsSub.closed).toBeFalse();

    const componentStyles: CSSStyleDeclaration = getComputedStyle(component.nativeElement);
    const trackXStyles: CSSStyleDeclaration = getComputedStyle(component._scrollbars.x.track.nativeElement);
    const trackYStyles: CSSStyleDeclaration = getComputedStyle(component._scrollbars.y.track.nativeElement);
    expect(componentStyles.getPropertyValue('--_scrollbar-pointer-events')).toBe('auto');
    expect(trackXStyles.pointerEvents).toBe('auto');
    expect(trackYStyles.pointerEvents).toBe('auto');
  }

  function interactionDisabledCases(): void {
    expect(component.disableInteraction()).toBeTrue();
    expect(component.nativeElement.getAttribute('disableInteraction')).toBe('true');

    expect(interactionSubscriptionXSpy).toHaveBeenCalled();
    expect(interactionSubscriptionYSpy).toHaveBeenCalled();

    const componentStyles: CSSStyleDeclaration = getComputedStyle(component.nativeElement);
    const trackXStyles: CSSStyleDeclaration = getComputedStyle(component._scrollbars.x.track.nativeElement);
    const trackYStyles: CSSStyleDeclaration = getComputedStyle(component._scrollbars.y.track.nativeElement);
    expect(componentStyles.getPropertyValue('--_scrollbar-pointer-events')).toBe('none');
    expect(trackXStyles.pointerEvents).toBe('none');
    expect(trackYStyles.pointerEvents).toBe('none');
  }

  it('should disable interactions for track and thumb', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 300, contentWidth: 300 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    interactionSubscriptionXSpy = spyOn(component._scrollbars.x._pointerEventsSub, 'unsubscribe');
    interactionSubscriptionYSpy = spyOn(component._scrollbars.y._pointerEventsSub, 'unsubscribe');

    interactionEnabledCases();

    fixture.componentRef.setInput('disableInteraction', true);
    fixture.detectChanges();

    interactionDisabledCases();

    fixture.componentRef.setInput('disableInteraction', false);
    fixture.detectChanges();

    interactionEnabledCases();
  });
});
