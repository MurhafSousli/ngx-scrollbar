import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';

describe('Appearance [native / compact] styles', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;
  const scrollbarSize: string = '13px';

  const directionalityMock = {
    value: 'ltr',
    change: new BehaviorSubject<string>('ltr'),
  };

  beforeEach( () => {
     TestBed.configureTestingModule({
      providers: [
        { provide: Directionality, useValue: directionalityMock }
      ]
    }).compileComponents();

    directionalityMock.value = 'ltr';
    directionalityMock.change.next('ltr');

    fixture = TestBed.createComponent(NgScrollbar);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;

    component.nativeElement.style.setProperty('--scrollbar-thickness', '5');
    component.nativeElement.style.setProperty('--scrollbar-offset', '4');
  });

  it('should set appearance="compact" attribute by default and 0px padding', () => {
    const appearanceAttr: string = component.nativeElement.getAttribute('appearance');
    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(appearanceAttr).toBe('compact');
    expect(styles.padding).toBe('0px');
  });

  it('should set appearance="native" attribute when [appearance]="native"', () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    fixture.componentRef.setInput('appearance', 'native');
    fixture.detectChanges();

    const appearanceAttr: string = component.nativeElement.getAttribute('appearance');
    expect(appearanceAttr).toBe('native');
  });

  it('should have "padding-right" and "padding-bottom" when its scrollable in both directions', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    fixture.componentRef.setInput('appearance', 'native');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe(scrollbarSize);
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-right" when its vertically scrollable', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });
    fixture.componentRef.setInput('appearance', 'native');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-bottom" when its horizontally scrollable', async () => {
    setDimensions(component, { cmpHeight: 100, contentHeight: 100, cmpWidth: 300, contentWidth: 1000 });
    fixture.componentRef.setInput('appearance', 'native');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingBottom).toBe(scrollbarSize);
    expect(styles.paddingRight).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-top" when its horizontally scrollable and [position]="invertX"', async () => {
    setDimensions(component, { cmpHeight: 100, contentHeight: 100, cmpWidth: 300, contentWidth: 1000 });
    fixture.componentRef.setInput('position', 'invertX');
    fixture.componentRef.setInput('appearance', 'native');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingTop).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-left" when its vertically scrollable and [position="invertY"]', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });
    fixture.componentRef.setInput('position', 'invertY');
    fixture.componentRef.setInput('appearance', 'native');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingLeft).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
  });

  it('should have "padding-left" and "padding-top" when its scrollbar in both directions and [position="invertAll"]', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });
    fixture.componentRef.setInput('position', 'invertAll');
    fixture.componentRef.setInput('appearance', 'native');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingTop).toBe(scrollbarSize);
    expect(styles.paddingLeft).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
  });

  it('should have "padding-left" when its vertically scrollable and [dir="rtl"]', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000, cmpWidth: 100, contentWidth: 100 });
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');
    fixture.componentRef.setInput('appearance', 'native');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingLeft).toBe(scrollbarSize);
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
  });

  it('should have "padding-right" when its vertically scrollable, [dir="rtl"] and [position]="invertY"', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');
    fixture.componentRef.setInput('appearance', 'native');
    fixture.componentRef.setInput('position', 'invertY');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingLeft).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingBottom).toBe('0px');
  });

  it('should have "padding-right" and "padding-top" when its scrollable in both directions, [dir="rtl"] and [position]="invertAll"', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });
    directionalityMock.value = 'rtl';
    directionalityMock.change.next('rtl');
    fixture.componentRef.setInput('appearance', 'native');
    fixture.componentRef.setInput('position', 'invertAll');
    await firstValueFrom(outputToObservable(component.afterInit))

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingTop).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });
});

