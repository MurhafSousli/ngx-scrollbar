import {
  Component,
  Inject,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subject, Subscription } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { SmoothScroll, SmoothScrollEaseFunc } from '../smooth-scroll/smooth-scroll';

@Component({
  selector: 'ng-scrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.trackX]': 'trackX',
    '[attr.trackY]': 'trackY',
    '[attr.compact]': 'compact',
    '[attr.autoHide]': 'autoHide'
  }
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
  @Input() scrollToDuration = 300;
  /** Compact mode */
  @Input() compact: boolean;
  /** Disable custom scrollbars on specific breakpoints */
  @Input() disableOnBreakpoints = [
    Breakpoints.HandsetLandscape,
    Breakpoints.HandsetPortrait
  ];

  /** Disable custom scrollbars and switch back to native scrollbars */
  @Input('disabled')
  get disabled() {
    return this._disabled;
  }

  set disabled(disable: boolean) {
    disable ? this.disable() : this.enable();
  }

  private _disabled = false;

  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  @ViewChild(SmoothScroll) smoothScroll: SmoothScroll;
  @ViewChild('y', {read: ElementRef}) verticalScrollbar: ElementRef;
  @ViewChild('x', {read: ElementRef}) horizontalScrollbar: ElementRef;

  /** Native scrollbar size */
  private _nativeScrollbarSize: string;

  get hideNativeScrollbars(): any {
    const size = this.disabled ? '100%' : `calc(100% + ${this._nativeScrollbarSize})`;
    return {
      width: this.trackY ? size : '100%',
      height: this.trackX ? size : '100%'
    };
  }

  /** Mutation observer subscription */
  private _updateObserverSub$ = Subscription.EMPTY;
  /** CDK breakpoint subscription */
  private _breakpointSub$ = Subscription.EMPTY;
  /** Viewport Element */
  view: HTMLElement;
  /** Observe content changes */
  private _observer: MutationObserver;

  /** Steam that emits when scrollbar thumbnail needs to update (for internal uses) */
  private _updateObserver = new Subject();
  updateObserver = this._updateObserver.asObservable();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              private _breakpointObserver: BreakpointObserver,
              @Inject(PLATFORM_ID) private _platform: Object) {
  }

  ngAfterViewInit() {
    this.view = this.scrollable.getElementRef().nativeElement;

    // Avoid 'expression has changed after it was checked' error when 'disableOnBreakpoints' is set to false
    Promise.resolve().then(() => {
      if (!this.disabled) {
        if (this.disableOnBreakpoints) {
          // Enable/Disable custom scrollbar on breakpoints (Used to disable scrollbars on mobile phones)
          this._breakpointSub$ = this._breakpointObserver.observe(this.disableOnBreakpoints).pipe(
            tap((result: BreakpointState) => result.matches ? this.disable() : this.enable())
          ).subscribe();
        } else {
          this.enable();
        }
      }

      // Update state on content changes
      this._updateObserverSub$ = this.updateObserver.pipe(
        throttleTime(200),
        tap(() => this._changeDetectorRef.markForCheck())
      ).subscribe();
    });
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
      this._disabled = false;
      // Calculate native scrollbars
      this._nativeScrollbarSize = `${this.view.offsetWidth - this.view.clientWidth + 1}px`;
      // Update view
      this._changeDetectorRef.markForCheck();

      if (this.autoUpdate && isPlatformBrowser(this._platform)) {
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
    this._disabled = true;
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
}
