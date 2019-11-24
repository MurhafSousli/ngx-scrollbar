import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import { ScrollbarManager } from './scrollbar-manager';

@Injectable({ providedIn: 'root' })
export class NativeScrollbarSizeFactory {
  private _nativeScrollbarSize: BehaviorSubject<number>;
  nativeScrollbarSize: Observable<number>;

  constructor(@Inject(DOCUMENT) private document: any,
              private manager: ScrollbarManager,
              private platform: Platform) {
    if (platform.isBrowser) {
      // Default = 0 as per https://github.com/MurhafSousli/ngx-scrollbar/wiki/global-options
      const windowResizeDebounce = this.manager.globalOptions
        .windowResizeDebounce? this.manager.globalOptions.windowResizeDebounce : 0;
      of(null).pipe(
        tap(() => this._nativeScrollbarSize = new BehaviorSubject<number>(this.getNativeScrollbarSize())),
        tap(() => this.nativeScrollbarSize = this._nativeScrollbarSize.asObservable()),
        switchMap(() => fromEvent(this.document.defaultView, 'resize', { passive: true })),
        debounceTime(windowResizeDebounce),
        tap(() => this._nativeScrollbarSize.next(this.getNativeScrollbarSize()))
      ).subscribe();
    }
  }

  /**
   * Get native scrollbar size
   */
  private getNativeScrollbarSize(): number {
    if (this.platform.ANDROID || this.platform.IOS) {
      return 6;
    }
    const box = this.document.createElement('div');
    box.className = 'ng-scrollbar-measure';
    this.document.body.appendChild(box);
    const size = box.getBoundingClientRect().right;
    this.document.body.removeChild(box);
    // if size is 0, return 15 (for MAC OS browsers)
    return size || 15;
  }
}
