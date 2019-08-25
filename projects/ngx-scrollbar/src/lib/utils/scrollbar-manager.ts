import { Inject, Injectable, Optional } from '@angular/core';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from '../ng-scrollbar.model';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

const defaultOptions: NgScrollbarOptions = {
  viewClass: '',
  trackClass: '',
  thumbClass: '',
  track: 'vertical',
  appearance: 'compact',
  visibility: 'native',
  position: 'native',
  thumbDragDisabled: false,
  trackClickDisabled: false,
  trackClickScrollDuration: 300,
  minThumbSize: 20,
  windowResizeDebounce: 0,
  sensorDebounce: 0,
  sensorDisabled: false
};

@Injectable({
  providedIn: 'root'
})
export class ScrollbarManager {

  private readonly nativeScrollbarSizeSource = new BehaviorSubject<number>(this.getNativeScrollbarSize());
  readonly nativeScrollbarSize: Observable<number> = this.nativeScrollbarSizeSource.asObservable();
  readonly globalOptions: NgScrollbarOptions;

  constructor(@Optional() @Inject(NG_SCROLLBAR_OPTIONS) private options: NgScrollbarOptions,
              @Inject(DOCUMENT) private document: any,
              private platform: Platform) {
    this.globalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    this.initResizeEvent();
  }

  /**
   * Start observing window resize to update the scrollbar component
   */
  private initResizeEvent() {
    fromEvent(this.document.defaultView, 'resize', { passive: true }).pipe(
      debounceTime(this.globalOptions.windowResizeDebounce),
      tap(() => this.nativeScrollbarSizeSource.next(this.getNativeScrollbarSize()))
    ).subscribe();
  }

  /**
   * Get native scrollbar size
   */
  getNativeScrollbarSize(): number {
    if (this.platform.isBrowser) {
      if (this.platform.ANDROID || this.platform.IOS) {
        return 6;
      }
      if (this.platform.SAFARI) {
        return 15;
      }
      const box = this.document.createElement('div');
      box.className = 'ng-scrollbar-measure';
      this.document.body.appendChild(box);
      const size = box.getBoundingClientRect().right;
      this.document.body.removeChild(box);
      return size;
    }
    return 0;
  }
}
