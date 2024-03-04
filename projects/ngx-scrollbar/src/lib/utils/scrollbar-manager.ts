import { Injectable, inject, signal, WritableSignal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { getRtlScrollAxisType, RtlScrollAxisType } from '@angular/cdk/platform';
import { NG_SCROLLBAR_POLYFILL } from '../ng-scrollbar.model';

const scrollTimelinePolyfillUrl: string = 'https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js';

@Injectable({ providedIn: 'root' })
export class ScrollbarManager {

  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  readonly _polyfillUrl: string = inject(NG_SCROLLBAR_POLYFILL, { optional: true }) || scrollTimelinePolyfillUrl;

  readonly document: Document = inject(DOCUMENT);

  readonly window: Window = this.document.defaultView;

  /**
   * Indicates the RTL scrollAxisType (used for dragging functionality)
   */
  readonly rtlScrollAxisType: RtlScrollAxisType = getRtlScrollAxisType();

  readonly scrollTimelinePolyfill: WritableSignal<any> = signal(null);

  constructor() {
    if (this.isBrowser && (!this.window['ScrollTimeline'] || !CSS.supports('animation-timeline', 'scroll()'))) {
      this.initPolyfill();
    }
  }

  async initPolyfill(): Promise<void> {
    try {
      // Create a script element
      const script: HTMLScriptElement = this.document.createElement('script');
      script.src = this._polyfillUrl;

      // Wait for the script to load
      await new Promise<any>((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        this.document.head.appendChild(script);
      });

      // Once loaded, access and execute the function attached to the window object
      if (this.window['ScrollTimeline']) {
        this.scrollTimelinePolyfill.set(this.window['ScrollTimeline']);
      } else {
        console.error('[NgScrollbar]: ScrollTimeline is not attached to the window object.');
      }
    } catch (error) {
      console.error('[NgScrollbar]: Error loading ScrollTimeline script:', error);
    }
  }
}
