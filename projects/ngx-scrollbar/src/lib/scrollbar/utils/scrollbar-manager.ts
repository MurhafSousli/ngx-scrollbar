import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from '../ng-scrollbar-config';

const defaultOptions: NgScrollbarOptions = {
  viewClass: '',
  trackClass: '',
  thumbClass: '',
  track: 'vertical',
  appearance: 'standard',
  visibility: 'native',
  position: 'native',
  disableThumbDrag: false,
  disableTrackClick: false,
  scrollToDuration: 300,
  minThumbSize: 20,
  windowResizeDebounce: 200,
  contentObserverDebounce: 0,
  resizeObserverDebounce: 0
};

@Injectable({
  providedIn: 'root'
})
export class ScrollbarManager {

  private readonly browserResizeStream = new BehaviorSubject<ScrollbarManagerState>({
    nativeScrollbarSize: this.getNativeScrollbarSize()
  readonly globalOptions: NgScrollbarOptions;
  readonly browserResized: Observable<ScrollbarManagerState> = this.browserResizeStream.asObservable();

  constructor(@Optional() @Inject(NG_SCROLLBAR_OPTIONS) private options: NgScrollbarOptions,
              @Inject(DOCUMENT) private document: any,
              private platform: Platform) {
    this.globalOptions = options ? {...defaultOptions, ...options} : defaultOptions;
    this.initResizeEvent();
  }

  /**
   * Start observing window resize to update the scrollbar component
   */
  private initResizeEvent() {
    fromEvent(this.document.defaultView, 'resize', { passive: true }).pipe(
      debounceTime(this.options.windowResizeDebounce),
      tap(() => this.browserResizeStream.next({ nativeScrollbarSize: this.getNativeScrollbarSize() }))
    ).subscribe();
  }

  /**
   * Get native scrollbar size
   */
  getNativeScrollbarSize(): number {
    if (this.platform.isBrowser) {
      if (this.platform.ANDROID || this.platform.IOS) {
        return 6;
      } else {
        const box = this.document.createElement('div');
        box.className = 'ng-scrollbar-measure';
        this.document.body.appendChild(box);
        const size = box.getBoundingClientRect().right;
        this.document.body.removeChild(box);
        return size;
      }
    }
    return 0;
  }
}
