import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
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

    component.nativeElement.style.setProperty('--scrollbar-thickness', '5');
    component.nativeElement.style.setProperty('--scrollbar-offset', '4');
  });

  it('should set appearance="native" attribute by default and 0px padding', () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    const appearanceAttr: string = component.nativeElement.getAttribute('appearance');
    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(appearanceAttr).toBe('native');
    expect(styles.padding).toBe('0px');
  });

  it('should set appearance="native" attribute when [appearance]="native"', () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();

    const appearanceAttr: string = component.nativeElement.getAttribute('appearance');
    expect(appearanceAttr).toBe('native');
  });

  it('should have "padding-right" and "padding-bottom" when its scrollable in both directions', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 500, contentWidth: 500 });
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe(scrollbarSize);
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-right" when its vertically scrollable', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-bottom" when its horizontally scrollable', async () => {
    setDimensions(component, { cmpHeight: 100, contentHeight: 100, cmpWidth: 300, contentWidth: 1000 });
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingBottom).toBe(scrollbarSize);
    expect(styles.paddingRight).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-top" when its horizontally scrollable and [position]="invertX"', async () => {
    setDimensions(component, { cmpHeight: 100, contentHeight: 100, cmpWidth: 300, contentWidth: 1000 });
    component.position = 'invertX';
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingTop).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });

  it('should have "padding-left" when its vertically scrollable and [position="invertY"]', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });
    component.position = 'invertY';
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingLeft).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
  });

  it('should have "padding-left" and "padding-top" when its scrollbar in both directions and [position="invertAll"]', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });
    component.position = 'invertAll';
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingTop).toBe(scrollbarSize);
    expect(styles.paddingLeft).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
  });

  it('should have "padding-left" when its vertically scrollable and [dir="rtl"]', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000, cmpWidth: 100, contentWidth: 100 });
    directionalityMock.value = 'rtl';
    component.appearance = 'native';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingLeft).toBe(scrollbarSize);
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingRight).toBe('0px');
  });

  it('should have "padding-right" when its vertically scrollable, [dir="rtl"] and [position]="invertY"', async () => {
    setDimensions(component, { cmpHeight: 300, contentHeight: 1000 });
    directionalityMock.value = 'rtl';
    component.appearance = 'native';
    component.position = 'invertY';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingLeft).toBe('0px');
    expect(styles.paddingTop).toBe('0px');
    expect(styles.paddingBottom).toBe('0px');
  });

  it('should have "padding-right" and "padding-top" when its scrollable in both directions, [dir="rtl"] and [position]="invertAll"', async () => {
    setDimensions(component, { cmpHeight: 200, cmpWidth: 200, contentHeight: 400, contentWidth: 400 });
    directionalityMock.value = 'rtl';
    component.appearance = 'native';
    component.position = 'invertAll';
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.paddingRight).toBe(scrollbarSize);
    expect(styles.paddingTop).toBe(scrollbarSize);
    expect(styles.paddingBottom).toBe('0px');
    expect(styles.paddingLeft).toBe('0px');
  });
});

