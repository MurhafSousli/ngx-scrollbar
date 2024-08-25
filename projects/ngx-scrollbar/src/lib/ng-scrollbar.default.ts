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
  buttons: false,
  hoverOffset: false
};

// This CDN link for a modified version of the polyfill to fix firefox bug https://github.com/MurhafSousli/ngx-scrollbar/issues/615
export const defaultScrollTimelinePolyfill: string = 'https://cdn.statically.io/gist/MurhafSousli/c852b6a672069396953f06ddd4b64620/raw/ef55db72e2abb7bc002ed79f4ad4cf408bfdb72f/scroll-timeline-lite.js';
