import { Inject, Injectable, Optional } from '@angular/core';
import { getRtlScrollAxisType, RtlScrollAxisType } from '@angular/cdk/platform';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from '../ng-scrollbar.model';

const defaultOptions: NgScrollbarOptions = {
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
  viewportPropagateMouseMove: true
};

@Injectable({ providedIn: 'root' })
export class ScrollbarManager {
  readonly globalOptions: NgScrollbarOptions;

  readonly rtlScrollAxisType: RtlScrollAxisType;

  constructor(@Optional() @Inject(NG_SCROLLBAR_OPTIONS) options: NgScrollbarOptions) {
    this.globalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;

    this.rtlScrollAxisType = getRtlScrollAxisType();
  }
}
