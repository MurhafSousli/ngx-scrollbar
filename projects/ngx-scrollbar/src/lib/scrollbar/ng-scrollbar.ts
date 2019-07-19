import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef, EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { fromEvent, Observable, Observer, Subject } from 'rxjs';
import { filter, map, pairwise, pluck, takeUntil, tap } from 'rxjs/operators';
import { ScrollViewport } from './scroll-viewport';
import { SmoothScrollEaseFunc, SmoothScrollManager, SmoothScrollToOptions } from '../smooth-scroll/smooth-scroll-manager';
import {
  NG_SCROLLBAR_DEFAULT_OPTIONS,
  NgScrollbarDefaultOptions,
  ScrollbarAppearance,
  ScrollbarTrack,
  ScrollbarPosition,
  ScrollbarVisibility
} from './ng-scrollbar-config';
import { ScrollbarManager, ScrollbarManagerState } from './utils/scrollbar-manager';

export interface NgScrollbarState {
  position?: ScrollbarPosition;
  track?: ScrollbarTrack;
  appearance?: ScrollbarAppearance;
  visibility?: ScrollbarVisibility;
  customView?: boolean;
  disabled?: boolean;
  dir?: 'rtl' | 'ltr';
  verticalUsed?: boolean;
  horizontalUsed?: boolean;
  isVerticallyScrollable?: boolean;
  isHorizontallyScrollable?: boolean;
}

@Component({
  selector: 'ng-scrollbar, [ngScrollbar], [ng-scrollbar]',
  exportAs: 'ngScrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ng-scrollbar]': 'true'
  }
})
export class NgScrollbar implements OnInit, AfterViewChecked, OnDestroy {

  /** Default viewport reference */
  @ViewChild('viewport', { static: true }) private defaultViewPort: ElementRef<HTMLElement>;
  /** Custom viewport reference */
  @ContentChild(ScrollViewport, { static: true }) private customViewPort: ScrollViewport;
  /** A class forwarded to scrollable viewport element */
  @Input() viewClass: string = this.defaultOptions.viewClass;
  /** A class forwarded to the scrollbar track element */
  @Input() trackClass: string = this.defaultOptions.trackClass;
  /** A class forwarded to the scrollbar thumb element */
  @Input() thumbClass: string = this.defaultOptions.thumbClass;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  @Input() scrollToDuration = this.defaultOptions.scrollToDuration;
  /** Minimum scrollbar thumb size */
  @Input() minThumbSize: number = this.defaultOptions.minThumbSize;
  /** A flag used to enable/disable the scrollbar thumb dragged event */
  @Input() disableThumbDrag: boolean = this.defaultOptions.disableThumbDrag;
  /** A flag used to enable/disable the scrollbar track clicked event */
  @Input() disableTrackClicks: boolean = this.defaultOptions.disableTrackClicks;
  /** Disable custom scrollbar-control and switch back to native scrollbar-control */
  @Input() disabled: boolean = false;
  /**
   * Sets the supported scroll track of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar-control
   * - `horizontal` Use both vertical and horizontal scrollbar-control
   * - `all` Use both vertical and horizontal scrollbar-control
   */
  @Input() track: ScrollbarTrack = this.defaultOptions.track;
  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar-control
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  @Input() visibility: ScrollbarVisibility = this.defaultOptions.visibility;
  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `standard` (default) scrollbar space will be reserved just like with native scrollbar-control.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  @Input() appearance: ScrollbarAppearance = this.defaultOptions.appearance;
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar-control.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar-control positions
   */
  @Input() position: ScrollbarPosition = this.defaultOptions.position;
  /** Steam that emits when scrollbar is updated */
  @Output() updated = new EventEmitter<void>();
  /** Viewport Element */
  view: HTMLElement;
  /** Content Wrapper element */
  contentWrapper: HTMLElement | undefined;
  /** stream that emits on scroll event */
  scrolled: Observable<any>;
  /** Steam that emits scroll event for vertical scrollbar */
  verticalScrolled: Observable<any>;
  /** Steam that emits scroll event for horizontal scrollbar */
  horizontalScrolled: Observable<any>;
  /** A flag that indicates if vertical scrollbar is used */
  verticalScrollbarUsed: boolean = false;
  /** A flag that indicates if horizontal scrollbar is used */
  horizontalScrollbarUsed: boolean = false;
  /** A flag that indicates if vertical scrollbar is scrollable */
  isVerticallyScrollable: boolean = false;
  /** A flag that indicates if horizontal scrollbar is scrollable */
  isHorizontallyScrollable: boolean = false;

  /** Stream that destroys components' observables */
  private destroyed = new Subject<void>();

  state: NgScrollbarState = {};

  constructor(private dir: Directionality,
              private ngZone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              private smoothScroll: SmoothScrollManager,
              private manager: ScrollbarManager,
              @Inject(NG_SCROLLBAR_DEFAULT_OPTIONS) private defaultOptions: NgScrollbarDefaultOptions) {
  }

  private getScrolledByDirection(track: ScrollbarTrack) {
    const scrollProperty = track === 'vertical' ? 'scrollTop' : 'scrollLeft';
    let event: any;
    return this.scrolled.pipe(
      tap((e: any) => event = e),
      pluck('target', scrollProperty),
      pairwise(),
      filter(([prev, curr]) => prev !== curr),
      map(() => event)
    );
  }

  /**
   * Update local state with each change detection
   */
  private updateState() {
    this.verticalScrollbarUsed = false;
    this.horizontalScrollbarUsed = false;
    /** Check if vertical scrollbar should be displayed */
    if (this.track === 'all' || this.track === 'vertical') {
      this.isVerticallyScrollable = this.view.scrollHeight > this.view.clientHeight;
      this.verticalScrollbarUsed = this.visibility === 'always' || this.isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
    if (this.track === 'all' || this.track === 'horizontal') {
      this.isHorizontallyScrollable = this.view.scrollWidth > this.view.clientWidth;
      this.horizontalScrollbarUsed = this.visibility === 'always' || this.isHorizontallyScrollable;
    }

    this.state = {
      position: this.position,
      track: this.track,
      appearance: this.appearance,
      visibility: this.visibility,
      customView: !!this.customViewPort,
      disabled: this.disabled,
      dir: this.dir.value,
      verticalUsed: this.verticalScrollbarUsed,
      horizontalUsed: this.horizontalScrollbarUsed,
      isVerticallyScrollable: this.isVerticallyScrollable,
      isHorizontallyScrollable: this.isHorizontallyScrollable
    };
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      // Set scroll viewport
      this.view = this.customViewPort
        ? this.customViewPort.viewPort.nativeElement
        : this.defaultViewPort.nativeElement;

      // Add active class to viewport
      // this.view.classList.add('active-viewport');

      if (this.view.children.length === 1) {
        this.contentWrapper = this.view.firstElementChild as HTMLElement;
        // Add active class to content wrapper
        this.contentWrapper.classList.add('active-content-wrapper');
      }

      this.manager.browserResized.pipe(
        tap((value: ScrollbarManagerState) =>
          this.view.style.setProperty('--native-scrollbar-size', `-${ value.nativeScrollbarSize }px`)
        ),
        takeUntil(this.destroyed)
      ).subscribe();

      // Initialize scroll streams
      this.scrolled = new Observable((observer: Observer<any>) =>
        fromEvent(this.view, 'scroll', { passive: true }).pipe(takeUntil(this.destroyed))
          .subscribe(observer));

      this.verticalScrolled = this.getScrolledByDirection('vertical');
      this.horizontalScrolled = this.getScrolledByDirection('horizontal');
    });
  }

  ngAfterViewChecked() {
    this.updateState();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /**
   * Update state including child components
   */
  update() {
    this.updated.next();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Smooth scroll functions
   */

  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.view, options);
  }

  scrollToElement(target: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToElement(this.view, target, offset, duration, easeFunc);
  }

  scrollToSelector(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToSelector(this.view, selector, offset, duration, easeFunc);
  }

  scrollToTop(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToTop(this.view, offset, duration, easeFunc);
  }

  scrollToBottom(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToBottom(this.view, offset, duration, easeFunc);
  }

  scrollToRight(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToRight(this.view, offset, duration, easeFunc);
  }

  scrollToLeft(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToLeft(this.view, offset, duration, easeFunc);
  }
}
