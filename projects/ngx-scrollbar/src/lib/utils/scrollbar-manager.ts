import { Inject, Injectable, Optional } from '@angular/core';
import { getRtlScrollAxisType, RtlScrollAxisType } from '@angular/cdk/platform';
import { IScrollbarOptions, NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from '../ng-scrollbar.model';

const defaultOptions: IScrollbarOptions = {
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
  pointerEventsDisabled: false,
  overscrollBehaivor: 'auto'
};

@Injectable({ providedIn: 'root' })
export class ScrollbarManager {
  readonly globalOptions: IScrollbarOptions;

  readonly rtlScrollAxisType: RtlScrollAxisType;

  constructor(@Optional() @Inject(NG_SCROLLBAR_OPTIONS) options: NgScrollbarOptions) {
    this.globalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;

    this.rtlScrollAxisType = getRtlScrollAxisType();
  }
}
