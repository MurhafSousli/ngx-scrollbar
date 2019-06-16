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
  PLATFORM_ID, ElementRef, NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Directionality } from '@angular/cdk/bidi';
import { fromEvent, Observable, Observer, Subject } from 'rxjs';
import { pairwise, takeUntil, tap, throttleTime, filter, pluck, map } from 'rxjs/operators';
import { CustomScrollView } from './custom-scroll-view';
import { ScrollToOptions, SmoothScroll, SmoothScrollEaseFunc } from '../smooth-scroll/smooth-scroll';
import {
  NG_SCROLLBAR_DEFAULT_OPTIONS,
  NgScrollbarAppearance,
  NgScrollbarDefaultOptions,
  NgScrollbarDirection,
  NgScrollbarVisibility
} from './ng-scrollbar-config';

@Component({
  selector: 'ng-scrollbar, [ngScrollbar]',
  exportAs: 'ngScrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ng-scrollbar]': 'true',
    '[attr.invertX]': 'invertX',
    '[attr.invertY]': 'invertY',
    '[attr.direction]': 'direction',
    '[attr.appearance]': 'appearance',
    '[attr.visibility]': 'visibility',
    '[attr.customView]': '!!customViewPort',
    '[attr.disabled]': 'disabled',
    '[attr.dir]': 'dir.value'
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
    return this.disabledFlag;
  }

  set disabled(disable: boolean) {
    disable ? this.disable() : this.enable();
  }

  private disabledFlag: boolean = false;

  /** Default viewport and smoothScroll references */
  @ViewChild('viewPort') viewElementRef: ElementRef<HTMLElement>;
  @ViewChild(SmoothScroll) viewSmoothScroll: SmoothScroll;

  /** Custom viewport reference */
  @ContentChild(CustomScrollView) customViewPort: CustomScrollView;

  /** Viewport Element */
  get view(): HTMLElement {
    return this.customViewPort
      ? this.customViewPort.viewPort.nativeElement
      : this.viewElementRef.nativeElement;
  }

  /** Returns the scrollable view reference */
  readonly elementScrolled: Observable<Event> = new Observable((observer: Observer<Event>) =>
    this.ngZone.runOutsideAngular(() =>
      fromEvent(this.view, 'scroll').pipe(takeUntil(this.destroyed))
        .subscribe(observer)));

  /** Returns the smoothScroll directive reference */
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

  /** Stream that destroys components' observables */
  private destroyed = new Subject();

  /** Steam that emits when scrollbar thumbnail needs to be updated (for internal uses) */
  private updater = new Subject<void>();
  updateObserver: Observable<void> = this.updater.asObservable();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              public dir: Directionality,
              private ngZone: NgZone,
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

  ngAfterViewInit() {
    // Avoid 'expression has changed after it was checked' error when 'disableOnBreakpoints' is set to false
    Promise.resolve().then(() => {
      if (!this.disabled) {
        if (this.disableOnBreakpoints) {
          // Enable/Disable custom scrollbar on breakpoints (Used to disable scrollbars on mobile phones)
          this.breakpointObserver.observe(this.disableOnBreakpoints).pipe(
            tap((result: BreakpointState) => result.matches ? this.disable() : this.enable()),
            takeUntil(this.destroyed)
          ).subscribe();
        } else {
          this.enable();
        }
      }

      // Update state on content changes
      this.updateObserver.pipe(
        throttleTime(200),
        tap(() => this.changeDetectorRef.markForCheck()),
        takeUntil(this.destroyed)
      ).subscribe();


      if (isPlatformBrowser(this.platform)) {
        // Update scrollbars when window is re-sized
        fromEvent(document.defaultView, 'resize').pipe(
          throttleTime(200),
          tap(() => this.update()),
          takeUntil(this.destroyed)
        ).subscribe();
      }
    });
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
