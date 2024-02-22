import { TestBed, waitForAsync } from '@angular/core/testing';
import { getRtlScrollAxisType } from '@angular/cdk/platform';
import { provideScrollbarPolyfill } from 'ngx-scrollbar';
import { ScrollbarManager } from '../utils/scrollbar-manager';

describe('ScrollbarManager Service', () => {

  let service: ScrollbarManager;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ScrollbarManager,
        provideScrollbarPolyfill('xyz')
      ]
    });

    service = TestBed.inject(ScrollbarManager);
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  // TODO: Test loading the polyfill script

  it('should have rtlScrollAxisType set', () => {
    expect(service.rtlScrollAxisType).toBe(getRtlScrollAxisType());
  });
});
