import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgScrollbar, provideScrollbarOptions } from 'ngx-scrollbar';

describe('Global options', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        provideScrollbarOptions({
          visibility: 'visible',
          appearance: 'compact',
          disableInteraction: true
        })
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
  });

  it('should override default options', () => {
    expect(component.appearance).toBe('compact');
    expect(component.visibility()).toBe('visible');
    expect(component.disableInteraction()).toBe(true);
  });
});
