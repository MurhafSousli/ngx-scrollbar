import { Injectable, Inject, inject, Optional, signal, WritableSignal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { getRtlScrollAxisType, RtlScrollAxisType } from '@angular/cdk/platform';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from '../ng-scrollbar.model';


const defaultOptions: NgScrollbarOptions = {
  scrollTimelinePolyfill: 'https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js',
  trackClass: '',
  thumbClass: '',
  orientation: 'auto',
  appearance: 'standard',
  visibility: 'native',
  position: 'native',
  clickScrollDuration: 50,
  sensorThrottleTime: 0,
  disableSensor: false,
  disableInteraction: false
};


@Injectable({ providedIn: 'root' })
export class ScrollbarManager {

  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  readonly document: Document = inject(DOCUMENT);

  readonly window: Window = this.document.defaultView;

  readonly globalOptions: NgScrollbarOptions = {};

  readonly rtlScrollAxisType: RtlScrollAxisType = getRtlScrollAxisType();

  readonly scrollTimelinePolyfill: WritableSignal<any> = signal(null);

  constructor(@Optional() @Inject(NG_SCROLLBAR_OPTIONS) options: NgScrollbarOptions) {
    this.globalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;

    if (this.isBrowser && !this.window['ScrollTimeline'] && !CSS.supports('animation-timeline', 'scroll()')) {
      this.initPolyfill();
    }
  }

  async initPolyfill(): Promise<void> {
    try {
      // Create a script element
      const script: HTMLScriptElement = this.document.createElement('script');
      script.src = this.globalOptions.scrollTimelinePolyfill;

      // Wait for the script to load
      await new Promise<any>((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        this.document.head.appendChild(script);
      });

      // Once loaded, access and execute the function attached to the window object
      if (this.window['ScrollTimeline']) {
        this.scrollTimelinePolyfill.set(window['ScrollTimeline']);
      } else {
        console.error('ScrollTimeline is not attached to the window object.');
      }
    } catch (error) {
      console.error('Error loading ScrollTimeline script:', error);
    }
  }
}
