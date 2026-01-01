import { Injectable, inject, signal, afterNextRender, WritableSignal, DOCUMENT } from '@angular/core';
import { NG_SCROLLBAR_POLYFILL } from '../ng-scrollbar.model';
import { ScrollTimelineFunc } from './common';

@Injectable({ providedIn: 'root' })
export class ScrollbarManager {

  readonly _polyfillUrl: string = inject(NG_SCROLLBAR_POLYFILL);

  readonly document: Document = inject(DOCUMENT);

  readonly window: Window = this.document.defaultView;

  readonly scrollTimelinePolyfill: WritableSignal<ScrollTimelineFunc> = signal(null);

  constructor() {
    afterNextRender({
      earlyRead: () => {
        if (!this.window['ScrollTimeline'] || !CSS.supports('animation-timeline', 'scroll()')) {
          this.initPolyfill();
        }
      }
    });
  }

  async initPolyfill(): Promise<void> {
    try {
      // Create a script element
      const script: HTMLScriptElement = this.document.createElement('script');
      script.src = this._polyfillUrl;
      script.async = true;

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
        console.error('[NgScrollbar]: Polyfill script loaded but ScrollTimeline not found.');
      }
    } catch (error) {
      console.error('[NgScrollbar]: Error loading ScrollTimeline script:', error);
    }
  }
}
