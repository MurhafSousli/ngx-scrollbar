import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgScrollbar } from 'ngx-scrollbar';

import { HideNativeScrollbar } from './hide-native-scrollbar';

describe('HideNativeScrollbar Directive', () => {
  let fixture: ComponentFixture<NgScrollbar>;
  let directiveElement: DebugElement;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        NgScrollbar
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgScrollbar);
    directiveElement = fixture.debugElement.query(By.directive(HideNativeScrollbar));
    fixture.detectChanges();
  }));

  it('should create hideNativeScrollbar directive', () => {
    expect(directiveElement).toBeDefined();
  });

  it('should set the native scrollbar size to the CSS variable', () => {
    const el: HTMLElement = directiveElement.nativeElement;
    const size = getComputedStyle(el).getPropertyValue('--native-scrollbar-size');
    expect(size).toBe(`-0px`);
  });
});

