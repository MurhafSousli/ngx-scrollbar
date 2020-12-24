import { TestBed } from '@angular/core/testing';
import { NativeScrollbarSizeFactory } from './native-scrollbar-size-factory';

describe('NativeScrollSizeFactory Service', () => {

  let service: NativeScrollbarSizeFactory;

  beforeEach(() => {
    service = TestBed.inject(NativeScrollbarSizeFactory);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should emit the native scrollbar size', (doneFn: DoneFn) => {
    service.scrollbarSize.subscribe((size: number) => {
      expect(size).toBe(getOS() === 'mac' ? 0 : 16);
      doneFn();
    });
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
