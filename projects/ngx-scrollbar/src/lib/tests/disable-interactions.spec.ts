import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { vi } from 'vitest';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { firstValueFrom } from 'rxjs';
import { setDimensions } from './common-test.';
import { ScrollbarButton } from '../button/scrollbar-button';
import { TrackAdapter } from '../track/track-adapter';
import { ThumbAdapter } from '../thumb/thumb-adapter';

describe('disableInteraction option', () => {
  let component: NgScrollbar;
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  let trackY: TrackAdapter;
  let thumbY: ThumbAdapter;
  let buttonYTop: ScrollbarButton;
  let buttonYBottom: ScrollbarButton;

  let trackYSpy;
  let thumbYSpy;
  let buttonYTopSpy;
  let buttonYBottomSpy;

  let trackX: TrackAdapter;
  let thumbX: ThumbAdapter;
  let buttonXStart: ScrollbarButton;
  let buttonXEnd: ScrollbarButton;

  let trackXSpy;
  let thumbXSpy;
  let buttonXStartSpy;
  let buttonXEndSpy;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    adapter = fixture.debugElement.injector.get(ViewportAdapter);
    fixture.componentRef.setInput('withButtons', true);
    fixture.detectChanges();
  });

  function interactionEnabledCases(): void {
    expect(adapter.disableInteraction()).toBe(false);
    expect(component.nativeElement.getAttribute('disableInteraction')).toBe('false');

    expect(trackY._pointerEventsSub.closed).toBe(false);
    expect(thumbY._pointerEventsSub.closed).toBe(false);
    expect(buttonYTop._pointerEventsSub.closed).toBe(false);
    expect(buttonYBottom._pointerEventsSub.closed).toBe(false);

    expect(trackX._pointerEventsSub.closed).toBe(false);
    expect(thumbX._pointerEventsSub.closed).toBe(false);
    expect(buttonXStart._pointerEventsSub.closed).toBe(false);
    expect(buttonXEnd._pointerEventsSub.closed).toBe(false);

    const componentStyles: CSSStyleDeclaration = getComputedStyle(component.nativeElement);
    // Get the styles of the parent element of the track
    // This will test the pointer-events for track, thumb and buttons
    const trackXWrapperStyles: CSSStyleDeclaration = getComputedStyle(trackX.nativeElement.parentElement);
    const trackYWrapperStyles: CSSStyleDeclaration = getComputedStyle(trackY.nativeElement.parentElement);
    expect(componentStyles.getPropertyValue('--_scrollbar-y-pointer-events')).toBe('auto');
    expect(componentStyles.getPropertyValue('--_scrollbar-x-pointer-events')).toBe('auto');
    expect(componentStyles.getPropertyValue('--_viewport-pointer-events')).toBe('auto');
    expect(componentStyles.pointerEvents).toBe('auto');
    expect(trackXWrapperStyles.pointerEvents).toBe('auto');
    expect(trackYWrapperStyles.pointerEvents).toBe('auto');
  }

  function interactionDisabledCases(): void {
    expect(adapter.disableInteraction()).toBe(true);
    expect(component.nativeElement.getAttribute('disableInteraction')).toBe('true');

    expect(trackYSpy).toHaveBeenCalled();
    expect(thumbYSpy).toHaveBeenCalled();
    expect(buttonYTopSpy).toHaveBeenCalled();
    expect(buttonYBottomSpy).toHaveBeenCalled();

    expect(trackXSpy).toHaveBeenCalled();
    expect(thumbXSpy).toHaveBeenCalled();
    expect(buttonXStartSpy).toHaveBeenCalled();
    expect(buttonXEndSpy).toHaveBeenCalled();

    const componentStyles: CSSStyleDeclaration = getComputedStyle(component.nativeElement);
    const trackXWrapperStyles: CSSStyleDeclaration = getComputedStyle(trackX.nativeElement.parentElement);
    const trackYWrapperStyles: CSSStyleDeclaration = getComputedStyle(trackY.nativeElement.parentElement);
    expect(componentStyles.getPropertyValue('--_scrollbar-y-pointer-events')).toBe('none');
    expect(componentStyles.getPropertyValue('--_scrollbar-x-pointer-events')).toBe('none');
    expect(componentStyles.getPropertyValue('--_viewport-pointer-events')).toBe('none');
    expect(componentStyles.pointerEvents).toBe('none');
    expect(trackXWrapperStyles.pointerEvents).toBe('none');
    expect(trackYWrapperStyles.pointerEvents).toBe('none');
  }

  it('should disable interactions for track and thumb', async () => {
    setDimensions(component, { cmpHeight: 100, cmpWidth: 100, contentHeight: 300, contentWidth: 300 });
    await firstValueFrom(outputToObservable(adapter.afterInit))
    TestBed.tick();

    trackY = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-track')).injector.get(TrackAdapter);
    thumbY = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-thumb')).injector.get(ThumbAdapter);
    buttonYTop = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-button[scrollbarButton="top"]')).injector.get(ScrollbarButton);
    buttonYBottom = fixture.debugElement.query(By.css('scrollbar-y .ng-scrollbar-button[scrollbarButton="bottom"]')).injector.get(ScrollbarButton);

    trackX = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-track')).injector.get(TrackAdapter);
    thumbX = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-thumb')).injector.get(ThumbAdapter);
    buttonXStart = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-button[scrollbarButton="start"]')).injector.get(ScrollbarButton);
    buttonXEnd = fixture.debugElement.query(By.css('scrollbar-x .ng-scrollbar-button[scrollbarButton="end"]')).injector.get(ScrollbarButton);

    trackYSpy = vi.spyOn(trackY._pointerEventsSub, 'unsubscribe');
    thumbYSpy = vi.spyOn(thumbY._pointerEventsSub, 'unsubscribe');
    buttonYTopSpy = vi.spyOn(buttonYTop._pointerEventsSub, 'unsubscribe');
    buttonYBottomSpy = vi.spyOn(buttonYBottom._pointerEventsSub, 'unsubscribe');

    trackXSpy = vi.spyOn(trackX._pointerEventsSub, 'unsubscribe');
    thumbXSpy = vi.spyOn(thumbX._pointerEventsSub, 'unsubscribe');
    buttonXStartSpy = vi.spyOn(buttonXStart._pointerEventsSub, 'unsubscribe');
    buttonXEndSpy = vi.spyOn(buttonXEnd._pointerEventsSub, 'unsubscribe');

    interactionEnabledCases();

    fixture.componentRef.setInput('disableInteraction', true);
    fixture.detectChanges();

    interactionDisabledCases();

    fixture.componentRef.setInput('disableInteraction', false);
    fixture.detectChanges();

    interactionEnabledCases();
  });
});
