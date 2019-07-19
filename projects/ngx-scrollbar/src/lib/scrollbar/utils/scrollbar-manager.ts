import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { NG_SCROLLBAR_DEFAULT_OPTIONS, NgScrollbarDefaultOptions } from '../ng-scrollbar-config';

export interface ScrollbarManagerState {
  nativeScrollbarSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollbarManager {

  private readonly browserResizeStream = new BehaviorSubject<ScrollbarManagerState>({
    nativeScrollbarSize: this.getNativeScrollbarSize()
  });
  readonly browserResized: Observable<ScrollbarManagerState> = this.browserResizeStream.asObservable();

  constructor(@Inject(NG_SCROLLBAR_DEFAULT_OPTIONS) private options: NgScrollbarDefaultOptions,
              @Inject(DOCUMENT) private document: any,
              private platform: Platform) {
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
