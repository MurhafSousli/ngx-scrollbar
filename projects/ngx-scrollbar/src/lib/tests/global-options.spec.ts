import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgScrollbar, provideScrollbarOptions, ViewportAdapter } from 'ngx-scrollbar';

describe('Global options', () => {
  let adapter: ViewportAdapter;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideScrollbarOptions({
          visibility: 'visible',
          appearance: 'compact',
          disableInteraction: true
        })
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NgScrollbar);
    adapter = fixture.debugElement.injector.get(ViewportAdapter);
  });

  it('should override default options', () => {
    expect(adapter.appearance()).toBe('compact');
    expect(adapter.visibility()).toBe('visible');
    expect(adapter.disableInteraction()).toBe(true);
  });
});
