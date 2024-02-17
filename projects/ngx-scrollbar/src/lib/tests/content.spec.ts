import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';

describe('Content scrollbars styles', () => {
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
  });

  it('should have the default content styles', () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 50, contentHeight: 50 });
    component.ngOnInit();
    component.ngAfterViewInit();
    const styles: CSSStyleDeclaration = getComputedStyle(component.viewport.contentWrapperElement);
    expect(styles.display).toBe('block');
    expect(styles.minWidth).toBe('100%');
    expect(styles.minHeight).toBe('100%');
    expect(styles.contain).toBe('content');
  });
});
