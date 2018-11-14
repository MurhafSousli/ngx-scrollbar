import {
  Component,
  Inject,
  Input,
  HostBinding,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ChangeDetectionStrategy,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subject, BehaviorSubject, Subscription, SubscriptionLike } from 'rxjs';
import { map, tap, throttleTime } from 'rxjs/operators';
import { SmoothScroll, SmoothScrollEaseFunc } from '../smooth-scroll/smooth-scroll';

interface NgScrollbarState {
  viewStyle?: {
    width?: string;
    height?: string;
    paddingRight?: string;
    paddingBottom?: string;
  };
  displayX?: boolean;
  displayY?: boolean;
}

const defaultState: NgScrollbarState = {
  viewStyle: {
    width: '100%',
    height: '100%',
    paddingRight: '0',
    paddingBottom: '0',
  },
  displayX: false,
  displayY: false
};

@Component({
  selector: 'ng-scrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgScrollbar implements AfterViewInit, OnDestroy {

  /** Horizontal custom scrollbar */
  @Input() trackX = false;
  /** Vertical custom Scrollbar */
  @Input() trackY = true;
  /** Auto hide scrollbars on mouse leave */
  @Input() autoHide = false;
  /** Auto update scrollbars on content changes (Mutation Observer) */
  @Input() autoUpdate = true;
  /** Viewport class */
  @Input() viewClass: string;
  /** Scrollbars class */
  @Input() barClass: string;
  /** Scrollbars thumbnails class */
  @Input() thumbClass: string;
  /** The smooth scroll duration when a scrollbar is clicked */
  @Input() scrollToDuration = 400;
  /** Use overlay scrollbars */
  @Input() overlay: boolean;
  /** Disable custom scrollbars on specific breakpoints */
  @Input() disableOnBreakpoints = [
    Breakpoints.HandsetLandscape,
    Breakpoints.HandsetPortrait
  ];

  /** Disable custom scrollbars and switch back to native scrollbars */
  @Input('disabled') set disableScrollbars(disable: boolean) {
    disable ? this.disable() : this.enable();
  }

  disabled = false;

  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  @ViewChild(SmoothScroll) smoothScroll: SmoothScroll;
  @ViewChild('vertical', {read: ElementRef}) verticalScrollbar: ElementRef;
  @ViewChild('horizontal', {read: ElementRef}) horizontalScrollbar: ElementRef;

  @HostBinding('class.ng-scrollbar-auto-hide') get autoHideClass() {
    return this.autoHide;
  }

  /** Native scrollbar size */
  private _nativeScrollbarSize: number;

  /** Scrollbar state */
  private _state = new BehaviorSubject<NgScrollbarState>(defaultState);
  viewStyle: Observable<any> = this._state.pipe(map((state: NgScrollbarState) => state.viewStyle));
  displayX: Observable<boolean> = this._state.pipe(map((state: NgScrollbarState) => state.displayX));
  displayY: Observable<boolean> = this._state.pipe(map((state: NgScrollbarState) => state.displayY));

  /** Mutation observer subscription */
  private _updateObserverSub$: SubscriptionLike = Subscription.EMPTY;
  /** CDK breakpoint subscription */
  private _breakpointSub$: SubscriptionLike = Subscription.EMPTY;
  /** Viewport Element */
  view: HTMLElement;
  /** Observe content changes */
  private _observer: MutationObserver;

  /** Steam that emits when scrollbar thumbnail needs to update (for internal uses) */
  private _updateObserver = new Subject();
  updateObserver = this._updateObserver.asObservable();

  constructor(private breakpointObserver: BreakpointObserver,
              @Inject(DOCUMENT) private document: any,
              @Inject(PLATFORM_ID) private platform: Object) {
  }

  ngAfterViewInit() {
    this.view = this.scrollable.getElementRef().nativeElement;

    if (this.disableOnBreakpoints) {
      // Enable/Disable custom scrollbar on breakpoints (Used to disable scrollbars on mobile phones)
      this._breakpointSub$ = this.breakpointObserver.observe(this.disableOnBreakpoints).pipe(
        // filter(() => this.viewInitialized),
        tap((result: BreakpointState) => result.matches ? this.disable() : this.enable())
      ).subscribe();
    } else {
      this.enable();
    }

    // Update state on content changes
    this._updateObserverSub$ = this.updateObserver.pipe(
      throttleTime(200),
      tap(() => this.updateState())
    ).subscribe();
  }

  ngOnDestroy() {
    this._breakpointSub$.unsubscribe();
    this._updateObserverSub$.unsubscribe();
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  /**
   * Update scrollbar thumbnail position
   */
  update() {
    if (!this.disabled) {
      this._updateObserver.next();
    }
  }

  /**
   * Enable custom scrollbar
   */
  enable() {
    if (this.view) {
      this.disabled = false;
      // Hide native scrollbars
      this._nativeScrollbarSize = this.getNativeScrollbarWidth();
      this.updateState();

      if (this.autoUpdate) {
        // Observe content changes
        this._observer = new MutationObserver(() => this.update());
        this._observer.observe(this.view, {subtree: true, childList: true, characterData: true});
      }
    }
  }

  /**
   * Disable custom scrollbar
   */
  disable() {
    this.disabled = true;
    // Show Native Scrollbars
    this._state.next(defaultState);
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  scrollTo(options: ScrollToOptions): Observable<void> {
    return this.smoothScroll.scrollTo(options);
  }

  scrollToElement(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Observable<void> {
    return this.smoothScroll.scrollToElement(selector, offset, duration, easeFunc);
  }

  scrollXTo(to: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Observable<void> {
    return this.smoothScroll.scrollXTo(to, duration, easeFunc);
  }

  scrollYTo(to: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Observable<void> {
    return this.smoothScroll.scrollYTo(to, duration, easeFunc);
  }

  scrollToTop(duration?: number, easeFunc?: SmoothScrollEaseFunc): Observable<void> {
    return this.smoothScroll.scrollToTop(duration, easeFunc);
  }

  scrollToBottom(duration?: number, easeFunc?: SmoothScrollEaseFunc): Observable<void> {
    return this.smoothScroll.scrollToBottom(duration, easeFunc);
  }

  scrollToRight(duration?: number, easeFunc?: SmoothScrollEaseFunc): Observable<void> {
    return this.smoothScroll.scrollToRight(duration, easeFunc);
  }

  scrollToLeft(duration?: number, easeFunc?: SmoothScrollEaseFunc): Observable<void> {
    return this.smoothScroll.scrollToLeft(duration, easeFunc);
  }

  private updateState() {
    let width = '100%', height = '100%', paddingBottom = '0', paddingRight = '0', displayY = false, displayX = false;
    if (this.trackY) {
      // Check if vertical scrollbar should be displayed
      if (this.view.scrollHeight > this.view.clientHeight) {
        displayY = true;
        width = `calc(100% + ${this._nativeScrollbarSize}px)`;
        paddingRight = this.overlay ? '0' : `${this._nativeScrollbarSize}px`;
      }
    }
    if (this.trackX) {
      // Check if horizontal scrollbar should be displayed
      if (this.view.scrollWidth > this.view.clientWidth) {
        displayX = true;
        height = `calc(100% + ${this._nativeScrollbarSize}px)`;
        paddingBottom = this.overlay ? '0' : `${this._nativeScrollbarSize}px`;
      }
    }
    this._state.next({viewStyle: {width, height, paddingBottom, paddingRight}, displayX, displayY});
  }

  /**
   * Get the native scrollbar width
   */
  private getNativeScrollbarWidth(): number {
    if (isPlatformBrowser(this.platform)) {
      const element = this.document.createElement('div');
      element.style.position = 'absolute';
      element.style.top = '-9999px';
      element.style.width = '100px';
      element.style.height = '100px';
      element.style.overflow = 'scroll';
      element.style.msOverflowStyle = 'scrollbar';
      this.document.body.appendChild(element);
      const sw = element.offsetWidth - element.clientWidth;
      this.document.body.removeChild(element);
      return sw;
    }
    return 0;
  }

}
