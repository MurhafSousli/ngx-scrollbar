import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgScrollbar } from '../ng-scrollbar';

import { HideNativeScrollbar } from './hide-native-scrollbar';
import { ScrollViewport } from '../scroll-viewport';

describe('HideNativeScrollbar Directive', () => {
  let fixture: ComponentFixture<NgScrollbar>;
  let directiveElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgScrollbar,
        HideNativeScrollbar,
        ScrollViewport
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgScrollbar);
    directiveElement = fixture.debugElement.query(By.directive(HideNativeScrollbar));
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create hideNativeScrollbar directive', () => {
    expect(directiveElement).toBeDefined();
  });

  it('should set the native scrollbar size to the CSS variable', (doneFn: DoneFn) => {
    setTimeout(() => {
      const el: HTMLElement = directiveElement.nativeElement;
      const size = getComputedStyle(el).getPropertyValue('--native-scrollbar-size');
      expect(size).toBe(getOS() === 'mac' ? '0px' : '16px');
      doneFn();
    }, 50);
  });
});

function getOS() {
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'mac';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'windows';
  } else if (!os && /Linux/.test(platform)) {
    os = 'linux';
  }
  return os;
}
