import { TestBed, waitForAsync } from '@angular/core/testing';
import { getRtlScrollAxisType } from '@angular/cdk/platform';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from 'ngx-scrollbar';
import { ScrollbarManager } from '../utils/scrollbar-manager';

const scrollbarOptions: NgScrollbarOptions = {
  scrollTimelinePolyfill: 'https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js',
  trackClass: '',
  thumbClass: '',
  orientation: 'auto',
  appearance: 'compact',
  visibility: 'native',
  position: 'native',
  clickScrollDuration: 50,
  sensorThrottleTime: 0,
  disableSensor: false,
  disableInteraction: false
};

const overrideOptions: NgScrollbarOptions = {
  appearance: 'standard',
  visibility: 'always'
};

describe('ScrollbarManager Service', () => {

  let service: ScrollbarManager;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ScrollbarManager,
        { provide: NG_SCROLLBAR_OPTIONS, useValue: overrideOptions }
      ]
    });

    service = TestBed.inject(ScrollbarManager);
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should override default options', () => {
    expect(service.globalOptions).toEqual({ ...{ ...scrollbarOptions, ...overrideOptions } });
  });

  it('should have rtlScrollAxisType set', () => {
    expect(service.rtlScrollAxisType).toBe(getRtlScrollAxisType());
  });
});
