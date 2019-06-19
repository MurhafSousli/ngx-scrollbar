import {
  Component,
  Inject,
  Input,
  ViewChild,
  ContentChild,
  AfterViewInit,
  AfterContentChecked,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ElementRef,
  NgZone,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Directionality } from '@angular/cdk/bidi';
import { fromEvent, Observable, Observer, Subject } from 'rxjs';
import { pairwise, takeUntil, tap, throttleTime, filter, pluck, map } from 'rxjs/operators';
import { CustomScrollView } from './custom-scroll-view';
import { SmoothScrollToOptions, SmoothScrollEaseFunc, SmoothScroller } from './smooth-scroller';
import {
  NG_SCROLLBAR_DEFAULT_OPTIONS,
  NgScrollbarDefaultOptions,
  NgScrollbarAppearance,
  NgScrollbarDirection,
  NgScrollbarPosition,
  NgScrollbarVisibility
} from './ng-scrollbar-config';

@Component({
  selector: 'ng-scrollbar, [ngScrollbar], [ng-scrollbar]',
  exportAs: 'ngScrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ng-scrollbar]': 'true',
    '[attr.position]': 'position',
    '[attr.direction]': 'direction',
    '[attr.appearance]': 'appearance',
    '[attr.visibility]': 'visibility',
    '[attr.customView]': '!!customViewPort',
    '[attr.disabled]': 'disabled',
    '[attr.dir]': 'dir.value'
  }
})
export class NgScrollbar implements AfterViewInit, AfterContentChecked, OnDestroy {

  /** Scroll tracking directions */
  @Input() direction: NgScrollbarDirection = this.globalOptions.direction;

  /** Scrollbar visibility */
  @Input() visibility: NgScrollbarVisibility = this.globalOptions.visibility;

  /** Scrollbar appearance */
  @Input() appearance: NgScrollbarAppearance = this.globalOptions.appearance;

  /** Scrollbar position */
  @Input() position: NgScrollbarPosition = this.globalOptions.position;

  /** Viewport class */
  @Input() viewClass: string = this.globalOptions.viewClass;

  /** Scrollbars class */
  @Input() barClass: string = this.globalOptions.barClass;

  /** Scrollbars thumbnails class */
  @Input() thumbClass: string = this.globalOptions.thumbClass;

  /** The smooth scroll duration when a scrollbar is clicked */
  @Input() scrollToDuration = this.globalOptions.scrollToDuration;

  /** Disable custom scrollbars on specific breakpoints */
  @Input() disableOnBreakpoints: string[] | string | 'unset' = this.globalOptions.disableOnBreakpoints;

  /** Auto update scrollbars on content changes (Mutation Observer) */
  @Input() autoUpdate: boolean = this.globalOptions.autoUpdate;

  /** Disable custom scrollbars and switch back to native scrollbars */
  @Input('disabled')
  get disabled(): boolean {
    return this.disabledFlag;
  }

  set disabled(disable: boolean) {
    disable ? this.disable() : this.enable();
  }

  private disabledFlag: boolean = false;

  /** Default viewport and smoothScroll references */
  @ViewChild('viewPort') viewElementRef: ElementRef<HTMLElement>;

  /** Custom viewport reference */
  @ContentChild(CustomScrollView) customViewPort: CustomScrollView;

  /** Viewport Element */
  get view(): HTMLElement {
    return this.customViewPort
      ? this.customViewPort.viewPort.nativeElement
      : this.viewElementRef.nativeElement;
  }

  /** A stream that emits on scroll event */
  readonly elementScrolled: Observable<Event> = new Observable((observer: Observer<Event>) =>
    this.ngZone.runOutsideAngular(() =>
      fromEvent(this.view, 'scroll').pipe(takeUntil(this.destroyed))
        .subscribe(observer)));

  readonly verticalScrollEvent: Observable<any> = this.getScrollEventByDirection('vertical');
  readonly horizontalScrollEvent: Observable<any> = this.getScrollEventByDirection('horizontal');

  /** Stream that destroys components' observables */
  private destroyed = new Subject();

  /** Steam that updates the custom scrollbars state when view content changes (for internal uses) */
  private updater = new Subject<void>();
  updateObserver: Observable<void> = this.updater.asObservable();

  /** Stream used to update scrollbars state on change detection.
   * Because we have many checks in the template that evaluates on every change detection.
   * To avoid duplicate checks, this stream will only evaluate the checks once and throttle change detection. */
  private readonly scrollbarsState = new Subject();

  /** A flag used to show vertical scrollbar */
  showScrollbarY: boolean = false;

  /** A flag used to show horizontal scrollbar */
  showScrollbarX: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              private ngZone: NgZone,
              private smoothScroll: SmoothScroller,
              public dir: Directionality,
              @Inject(NG_SCROLLBAR_DEFAULT_OPTIONS) private globalOptions: NgScrollbarDefaultOptions,
              @Inject(PLATFORM_ID) private platform: Object) {
  }

  private getScrollEventByDirection(direction: 'vertical' | 'horizontal') {
    const scrollProperty = direction === 'vertical' ? 'scrollTop' : 'scrollLeft';
    let event: Event;
    return this.elementScrolled.pipe(
      tap((e: Event) => event = e),
      pluck('target', scrollProperty),
      pairwise(),
      filter(([prev, curr]) => prev !== curr),
      map(() => event)
    );
  }

  private updateOnChangeDetection() {
    // Throttle change detection
    this.scrollbarsState.pipe(
      throttleTime(100),
      tap(() => {
        this.showScrollbarY = (this.direction === 'all' || this.direction === 'vertical') &&
          (this.visibility === 'always' || this.view.scrollHeight > this.view.clientHeight);

        this.showScrollbarX = (this.direction === 'all' || this.direction === 'horizontal') &&
          (this.visibility === 'always' || this.view.scrollWidth > this.view.clientWidth);
      }),
      takeUntil(this.destroyed)
    ).subscribe();
  }

  private updateOnBreakpointsChanges() {
    if (!this.disabled) {
      if (this.disableOnBreakpoints !== 'unset') {
        // Enable/Disable custom scrollbar on breakpoints (Used to disable scrollbars on mobile phones)
        this.breakpointObserver.observe(this.disableOnBreakpoints).pipe(
          tap((result: BreakpointState) => result.matches ? this.disable() : this.enable()),
          takeUntil(this.destroyed)
        ).subscribe();
      } else {
        this.enable();
      }
    }
  }

  private updateOnContentChanges() {
    // Update state on content changes
    this.updateObserver.pipe(
      throttleTime(200),
      // tap(() => this.changeDetectorRef.markForCheck()),
      tap(() => this.scrollbarsState.next()),
      takeUntil(this.destroyed)
    ).subscribe();
  }

  private updateOnWindowSizeChanges() {
    if (isPlatformBrowser(this.platform)) {
      // Update scrollbars when window is re-sized
      fromEvent(document.defaultView, 'resize').pipe(
        throttleTime(200),
        tap(() => this.update()),
        takeUntil(this.destroyed)
      ).subscribe();
    }
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.updateOnChangeDetection();
      this.updateOnBreakpointsChanges();
      this.updateOnContentChanges();
      this.updateOnWindowSizeChanges();
    });
  }

  ngAfterContentChecked() {
    this.scrollbarsState.next();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /**
   * Update scrollbar thumbnail position
   */
  update() {
    this.updater.next();
  }

  /**
   * Enable custom scrollbar
   */
  enable() {
    if (this.view) {
      this.disabledFlag = false;
      // Mark for a check to update scrollbar state
      this.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Disable custom scrollbar
   */
  disable() {
    this.disabledFlag = true;
  }

  /**
   * Smooth scroll functions
   */

  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.view, options);
  }

  scrollToElement(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToElement(this.view, selector, offset, duration, easeFunc);
  }

  scrollXTo(to: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollXTo(this.view, to, duration, easeFunc);
  }

  scrollYTo(to: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollYTo(this.view, to, duration, easeFunc);
  }

  scrollToTop(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToTop(this.view, duration, easeFunc);
  }

  scrollToBottom(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToBottom(this.view, duration, easeFunc);
  }

  scrollToRight(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToRight(this.view, duration, easeFunc);
  }

  scrollToLeft(duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToLeft(this.view, duration, easeFunc);
  }
}
