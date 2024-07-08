import { Injectable, inject, signal, WritableSignal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NG_SCROLLBAR_POLYFILL } from '../ng-scrollbar.model';
import { ScrollTimelineFunc } from './common';

// This CDN link is for a modified version of the polyfill to fix the firefox bug https://github.com/MurhafSousli/ngx-scrollbar/issues/615
const scrollTimelinePolyfillUrl: string = 'https://cdn.statically.io/gist/MurhafSousli/c852b6a672069396953f06ddd4b64620/raw/7089126915c424e85fba611d179fc5687b8743a0/scroll-timeline.js';

@Injectable({ providedIn: 'root' })
export class ScrollbarManager {

  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  readonly _polyfillUrl: string = inject(NG_SCROLLBAR_POLYFILL, { optional: true }) || scrollTimelinePolyfillUrl;

  readonly document: Document = inject(DOCUMENT);

  readonly window: Window = this.document.defaultView;

  readonly scrollTimelinePolyfill: WritableSignal<ScrollTimelineFunc> = signal(null);

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
      await new Promise<Event>((resolve, reject) => {
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
