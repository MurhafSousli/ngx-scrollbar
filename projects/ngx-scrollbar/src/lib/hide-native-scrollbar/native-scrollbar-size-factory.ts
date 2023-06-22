import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Observable, fromEvent, debounceTime, tap, distinctUntilChanged, map } from 'rxjs';
import { ScrollbarManager } from '../utils/scrollbar-manager';

@Injectable({ providedIn: 'root' })
export class NativeScrollbarSizeFactory {
  private readonly _scrollbarSize = new BehaviorSubject<number>(this.getNativeScrollbarSize());
  scrollbarSize: Observable<number> = this._scrollbarSize.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document,
              private manager: ScrollbarManager,
              private platform: Platform) {
    // Calculate native scrollbar size on window resize event, because the size changes if use zoomed in/out
    if (platform.isBrowser) {
      fromEvent(this.document.defaultView, 'resize', { passive: true }).pipe(
        debounceTime(this.manager.globalOptions.windowResizeDebounce),
        map(() => this.getNativeScrollbarSize()),
        distinctUntilChanged(),
        tap((size: number) => this._scrollbarSize.next(size))
      ).subscribe();
    }
  }

  /**
   * Get native scrollbar size
   */
  private getNativeScrollbarSize(): number {
    // Avoid executing browser code in server side rendering
    if (!this.platform.isBrowser) {
      return 0;
    }
    // Hide iOS browsers native scrollbar
    if (this.platform.IOS) {
      return 6;
    }
    const box = this.document.createElement('div');
    box.className = 'ng-scrollbar-measure';
    box.style.left = '0px';
    box.style.overflow = 'scroll';
    box.style.position = 'fixed';
    box.style.top = '-9999px';
    this.document.body.appendChild(box);
    const size = box.getBoundingClientRect().right;
    this.document.body.removeChild(box);
    return size;
  }
}
