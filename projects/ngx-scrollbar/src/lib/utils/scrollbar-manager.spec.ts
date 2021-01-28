import { TestBed, waitForAsync } from '@angular/core/testing';
import { getRtlScrollAxisType } from '@angular/cdk/platform';
import { ScrollbarManager } from './scrollbar-manager';
import { IScrollbarOptions, NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from '../ng-scrollbar.model';

const scrollbarOptions: IScrollbarOptions = {
  viewClass: '',
  trackClass: '',
  thumbClass: '',
  track: 'vertical',
  appearance: 'compact',
  visibility: 'native',
  position: 'native',
  pointerEventsMethod: 'viewport',
  trackClickScrollDuration: 300,
  minThumbSize: 20,
  windowResizeDebounce: 0,
  sensorDebounce: 0,
  scrollAuditTime: 0,
  viewportPropagateMouseMove: true,
  autoHeightDisabled: true,
  autoWidthDisabled: true,
  sensorDisabled: false,
  pointerEventsDisabled: false
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
        {
          provide: NG_SCROLLBAR_OPTIONS, useValue: overrideOptions
        }
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
