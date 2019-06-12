import {
  Component,
  Inject,
  Input,
  ViewChild,
  ContentChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CdkScrollable, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { fromEvent, Observable, Subject } from 'rxjs';
import { pairwise, takeUntil, tap, throttleTime, filter, pluck, map } from 'rxjs/operators';
import { VirtualScrollView } from '../virtual-scroll';
import { ScrollToOptions, SmoothScroll, SmoothScrollEaseFunc } from '../smooth-scroll';
import {
  NG_SCROLLBAR_DEFAULT_OPTIONS,
  NgScrollbarAppearance,
  NgScrollbarDefaultOptions,
  NgScrollbarDirection,
  NgScrollbarVisibility
} from './ng-scrollbar-config';

@Component({
  selector: 'ng-scrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.invertX]': 'invertX',
    '[attr.invertY]': 'invertY',
    '[attr.direction]': 'direction',
    '[attr.appearance]': 'appearance',
    '[attr.visibility]': 'visibility',
    '[attr.customView]': '!!customViewPort',
    '[attr.disabled]': 'disabled'
  }
})
export class NgScrollbar implements AfterViewInit, OnDestroy {

  /** Scroll direction to track */
  @Input() direction: NgScrollbarDirection = this.globalOptions.direction;

  /** Scrollbar visibility */
  @Input() visibility: NgScrollbarVisibility = this.globalOptions.visibility;

  /** Scrollbar appearance */
  @Input() appearance: NgScrollbarAppearance = this.globalOptions.appearance;

  /** Viewport class */
  @Input() viewClass: string = this.globalOptions.viewClass;

  /** Scrollbars class */
  @Input() barClass: string = this.globalOptions.barClass;

  /** Scrollbars thumbnails class */
  @Input() thumbClass: string = this.globalOptions.thumbClass;

  /** The smooth scroll duration when a scrollbar is clicked */
  @Input() scrollToDuration = this.globalOptions.scrollToDuration;

  /** Invert vertical scrollbar position, if set the scrollbar will be on the right */
  @Input() invertY: boolean = this.globalOptions.invertY;

  /** Invert horizontal scrollbar position, if set the scrollbar will go the top */
  @Input() invertX: boolean = this.globalOptions.invertX;

  /** Disable custom scrollbars on specific breakpoints */
  @Input() disableOnBreakpoints: string[] | string = this.globalOptions.disableOnBreakpoints;

  /** Auto update scrollbars on content changes (Mutation Observer) */
  @Input() autoUpdate: boolean = this.globalOptions.autoUpdate;

  /** Disable custom scrollbars and switch back to native scrollbars */
  @Input('disabled')
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(disable: boolean) {
    disable ? this.disable() : this.enable();
  }

  private _disabled: boolean = false;

  /** Default viewport and smoothScroll references */
  @ViewChild(CdkScrollable) scrollViewport: CdkScrollable;
  @ViewChild(SmoothScroll) viewSmoothScroll: SmoothScroll;

  /** Virtual viewport and smoothScroll references */
  @ContentChild(VirtualScrollView) customViewPort: VirtualScrollView;

  /** Viewport Element */
  get view(): HTMLElement {
    return this.customViewPort
      ? this.customViewPort.virtualScrollViewport.getElementRef().nativeElement
      : this.scrollViewport.getElementRef().nativeElement;
  }

  get scrollable(): CdkScrollable | CdkVirtualScrollViewport {
    return this.customViewPort
      ? this.customViewPort.virtualScrollViewport
      : this.scrollViewport;
  }

  get smoothScroll(): SmoothScroll {
    return this.customViewPort
      ? this.customViewPort.smoothScroll
      : this.viewSmoothScroll;
  }

  get verticalScrollEvent(): Observable<any> {
    return this.getScrollEventByDirection('vertical');
  }

  get horizontalScrollEvent(): Observable<any> {
    return this.getScrollEventByDirection('horizontal');
  }

  get showScrollbarY(): boolean {
    return this.visibility === 'always' || this.view.scrollHeight > this.view.clientHeight;
  }

  get showScrollbarX(): boolean {
    return this.visibility === 'always' || this.view.scrollWidth > this.view.clientWidth;
  }

  /** Unsubscribe component observables on destroy */
  private _unsubscribe$ = new Subject();
  /** Observe content changes */
  private _observer: MutationObserver;

  /** Steam that emits when scrollbar thumbnail needs to update (for internal uses) */
  private _updateObserver = new Subject();
  updateObserver = this._updateObserver.asObservable();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              private _breakpointObserver: BreakpointObserver,
              @Inject(NG_SCROLLBAR_DEFAULT_OPTIONS) private globalOptions: NgScrollbarDefaultOptions,
              @Inject(PLATFORM_ID) private _platform: Object) {
  }

  private getScrollEventByDirection(direction: 'vertical' | 'horizontal') {
    const scrollProperty = direction === 'vertical' ? 'scrollTop' : 'scrollLeft';
    let event: any;
    return this.scrollable.elementScrolled().pipe(
      tap((e: any) => event = e),
      pluck('target', scrollProperty),
      pairwise(),
      filter(([prev, curr]) => prev !== curr),
      map(() => event)
    );
  }

  ngAfterViewInit() {
    // Avoid 'expression has changed after it was checked' error when 'disableOnBreakpoints' is set to false
    Promise.resolve().then(() => {
      if (!this.disabled) {
        if (this.disableOnBreakpoints) {
          // Enable/Disable custom scrollbar on breakpoints (Used to disable scrollbars on mobile phones)
          this._breakpointObserver.observe(this.disableOnBreakpoints).pipe(
            tap((result: BreakpointState) => result.matches ? this.disable() : this.enable()),
            takeUntil(this._unsubscribe$)
          ).subscribe();
        } else {
          this.enable();
        }
      }

      // Update state on content changes
      this.updateObserver.pipe(
        throttleTime(200),
        tap(() => this._changeDetectorRef.markForCheck()),
        takeUntil(this._unsubscribe$)
      ).subscribe();


      if (isPlatformBrowser(this._platform)) {
        // Update scrollbars when window is re-sized
        fromEvent(document.defaultView, 'resize').pipe(
          throttleTime(200),
          tap(() => this.update()),
          takeUntil(this._unsubscribe$)
        ).subscribe();
      }
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
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
      // Update view
      this._changeDetectorRef.markForCheck();

      if (!this.customViewPort && this.autoUpdate && isPlatformBrowser(this._platform)) {
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

  scrollTo(options: ScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(options);
  }

  scrollToElement(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToElement(selector, offset, duration, easeFunc);
  }

  scrollXTo(to: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollXTo(to, duration, easeFunc);
  }

  scrollYTo(to: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollYTo(to, duration, easeFunc);
  }

  scrollToTop(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToTop(duration, easeFunc);
  }

  scrollToBottom(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToBottom(duration, easeFunc);
  }

  scrollToRight(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToRight(duration, easeFunc);
  }

  scrollToLeft(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToLeft(duration, easeFunc);
  }
}
