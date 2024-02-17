import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';

describe('Native scrollbars', () => {
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

  it('should hide the native scrollbars by default', () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 200, contentHeight: 200 });
    component.ngOnInit();

    const pseudoStyle: CSSStyleDeclaration = getComputedStyle(component.viewport.nativeElement, '::-webkit-scrollbar');
    const scrollbarDisplay: string = pseudoStyle.getPropertyValue('display');

    expect(scrollbarDisplay).toBe('none');
  });
});
