import { NgScrollbarOptions } from './ng-scrollbar.model';

export const defaultOptions: NgScrollbarOptions = {
  trackClass: '',
  thumbClass: '',
  buttonClass: '',
  orientation: 'auto',
  appearance: 'native',
  visibility: 'native',
  position: 'native',
  trackScrollDuration: 50,
  sensorThrottleTime: 0,
  disableSensor: false,
  disableInteraction: false,
  withButtons: false,
  hoverOffset: false,
  scrollHideDelay: 400,
  scrollThrottleTime: 200
};

// This CDN link for a modified version of the polyfill to fix firefox bug https://github.com/MurhafSousli/ngx-scrollbar/issues/615
export const defaultScrollTimelinePolyfill: string = 'https://cdn.jsdelivr.net/gh/MurhafSousli/ngx-scrollbar@19.1.0/projects/ngx-scrollbar/src/assets/scroll-timeline-polyfill.js';
