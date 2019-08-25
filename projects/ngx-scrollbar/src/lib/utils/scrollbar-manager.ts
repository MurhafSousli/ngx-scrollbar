import { Inject, Injectable, Optional } from '@angular/core';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from '../ng-scrollbar.model';

const defaultOptions: NgScrollbarOptions = {
  viewClass: '',
  trackClass: '',
  thumbClass: '',
  track: 'vertical',
  appearance: 'compact',
  visibility: 'native',
  position: 'native',
  thumbDragDisabled: false,
  trackClickDisabled: false,
  trackClickScrollDuration: 300,
  minThumbSize: 20,
  windowResizeDebounce: 0,
  sensorDebounce: 0,
  sensorDisabled: false
};

@Injectable({ providedIn: 'root' })
export class ScrollbarManager {
  readonly globalOptions: NgScrollbarOptions;

  constructor(@Optional() @Inject(NG_SCROLLBAR_OPTIONS) options: NgScrollbarOptions) {
    this.globalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
  }
}
