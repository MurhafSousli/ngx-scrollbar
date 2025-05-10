import { NgScrollbarOptions } from './ng-scrollbar.model';

export const defaultOptions: NgScrollbarOptions = {
  trackClass: '',
  thumbClass: '',
  buttonClass: '',
  orientation: 'auto',
  appearance: 'compact',
  visibility: 'native',
  position: 'native',
  trackScrollDuration: 50,
  sensorThrottleTime: 0,
  disableSensor: false,
  disableInteraction: false,
  buttons: false,
  hoverOffset: false
};

// This CDN link for a modified version of the polyfill to fix firefox bug https://github.com/MurhafSousli/ngx-scrollbar/issues/615
export const defaultScrollTimelinePolyfill: string = 'https://cdn.statically.io/gh/MurhafSousli/ngx-scrollbar@refs/heads/master/projects/ngx-scrollbar/src/assets/scroll-timeline-polyfill.js';
