import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
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
import { ScrollbarManager } from './utils/scrollbar-manager';

export interface NgScrollbarState {
  position?: ScrollbarPosition;
  track?: ScrollbarTrack;
  appearance?: ScrollbarAppearance;
  visibility?: ScrollbarVisibility;
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
  @Input() disableTrackClick: boolean = this.defaultOptions.disableTrackClick;
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
  viewport: HTMLElement;
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
  /** Default viewport classes */
  viewportClasses: any;

  /** Stream that destroys components' observables */
  private destroyed = new Subject<void>();

  state: NgScrollbarState = {};

  constructor(private dir: Directionality,
              private ngZone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              private smoothScroll: SmoothScrollManager,
              public manager: ScrollbarManager,
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
      this.isVerticallyScrollable = this.viewport.scrollHeight > this.viewport.clientHeight;
      this.verticalScrollbarUsed = this.visibility === 'always' || this.isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
    if (this.track === 'all' || this.track === 'horizontal') {
      this.isHorizontallyScrollable = this.viewport.scrollWidth > this.viewport.clientWidth;
      this.horizontalScrollbarUsed = this.visibility === 'always' || this.isHorizontallyScrollable;
    }

    this.state = {
      position: this.position,
      track: this.track,
      appearance: this.appearance,
      visibility: this.visibility,
      disabled: this.disabled,
      dir: this.dir.value,
      verticalUsed: this.verticalScrollbarUsed,
      horizontalUsed: this.horizontalScrollbarUsed,
      isVerticallyScrollable: this.isVerticallyScrollable,
      isHorizontallyScrollable: this.isHorizontallyScrollable
    };
    this.changeDetectorRef.detectChanges();
  }

  private activateViewport() {
    if (this.customViewPort) {
      // Set the custom viewport and the viewport
      this.viewport = this.customViewPort.viewPort.nativeElement;
      // Check if the custom viewport has only one child and set it as the content wrapper
      if (this.viewport.children.length === 1) {
        this.contentWrapper = this.viewport.firstElementChild as HTMLElement;
      }
      // Set the default viewport and the default content wrapper
      this.viewportClasses = {
        'ng-scroll-offset': true,
        'ng-scroll-layer': true
      };
      this.defaultViewPort.nativeElement.firstElementChild.className = 'ng-scroll-layer';
    } else {
      // Set the default viewport as the scroll viewport
      this.viewport = this.defaultViewPort.nativeElement;
      this.viewportClasses = {
        'ng-scroll-offset': true,
        'ng-scroll-viewport': true,
        [this.viewClass]: true,
      };
      // Set the default content wrapper as the content wrapper
      this.contentWrapper = this.viewport.firstElementChild as HTMLElement;
      this.contentWrapper.className = 'ng-scroll-content';
    }
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.activateViewport();

      // Initialize scroll streams
      this.scrolled = new Observable((observer: Observer<any>) =>
        fromEvent(this.viewport, 'scroll').pipe(takeUntil(this.destroyed))
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
    return this.smoothScroll.scrollTo(this.viewport, options);
  }

  scrollToElement(target: HTMLElement, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport, target, offset, duration, easeFunc);
  }

  scrollToSelector(selector: string, offset = 0, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToSelector(this.viewport, selector, offset, duration, easeFunc);
  }

  scrollToTop(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToTop(this.viewport, offset, duration, easeFunc);
  }

  scrollToBottom(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToBottom(this.viewport, offset, duration, easeFunc);
  }

  scrollToRight(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToRight(this.viewport, offset, duration, easeFunc);
  }

  scrollToLeft(offset?: number, duration?: number, easeFunc?: SmoothScrollEaseFunc): Promise<void> {
    return this.smoothScroll.scrollToLeft(this.viewport, offset, duration, easeFunc);
  }
}
