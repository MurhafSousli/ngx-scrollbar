import {
  Component,
  ViewChild,
  ContentChild,
  Input,
  Output,
  OnInit,
  AfterViewChecked,
  OnDestroy,
  NgZone,
  ElementRef,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { fromEvent, Observable, Observer, Subject } from 'rxjs';
import { filter, map, pairwise, pluck, takeUntil, tap } from 'rxjs/operators';
import { ScrollViewport } from './scroll-viewport';
import { SmoothScrollEaseFunc, SmoothScrollManager, SmoothScrollToOptions } from 'ngx-scrollbar/smooth-scroll';
import {
  ScrollbarAppearance,
  ScrollbarTrack,
  ScrollbarPosition,
  ScrollbarVisibility,
  NgScrollbarState
} from './ng-scrollbar-config';
import { ScrollbarManager } from './utils/scrollbar-manager';

@Component({
  selector: 'ng-scrollbar',
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
  @Input() viewClass: string = this.manager.globalOptions.viewClass;
  /** A class forwarded to the scrollbar track element */
  @Input() trackClass: string = this.manager.globalOptions.trackClass;
  /** A class forwarded to the scrollbar thumb element */
  @Input() thumbClass: string = this.manager.globalOptions.thumbClass;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  @Input() scrollToDuration = this.manager.globalOptions.scrollToDuration;
  /** Minimum scrollbar thumb size */
  @Input() minThumbSize: number = this.manager.globalOptions.minThumbSize;
  /** A flag used to enable/disable the scrollbar thumb dragged event */
  @Input() disableThumbDrag: boolean = this.manager.globalOptions.disableThumbDrag;
  /** A flag used to enable/disable the scrollbar track clicked event */
  @Input() disableTrackClick: boolean = this.manager.globalOptions.disableTrackClick;
  /** Disable custom scrollbar and switch back to native scrollbar */
  @Input() disabled: boolean = false;
  /**
   * Sets the supported scroll track of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar
   * - `horizontal` Use both vertical and horizontal scrollbar
   * - `all` Use both vertical and horizontal scrollbar
   */
  @Input() track: ScrollbarTrack = this.manager.globalOptions.track;
  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  @Input() visibility: ScrollbarVisibility = this.manager.globalOptions.visibility;
  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `standard` (default) scrollbar space will be reserved just like with native scrollbar.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  @Input() appearance: ScrollbarAppearance = this.manager.globalOptions.appearance;
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar positions
   */
  @Input() position: ScrollbarPosition = this.manager.globalOptions.position;
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
  /** Default viewport classes */
  viewportClasses: any;

  /** Stream that destroys components' observables */
  private destroyed = new Subject<void>();

  /** Set of attributes added on the scrollbar wrapper */
  state: NgScrollbarState = {};

  constructor(private dir: Directionality,
              private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              private smoothScroll: SmoothScrollManager,
              public el: ElementRef,
              public manager: ScrollbarManager) {
  }

  private getScrolledByDirection(track: ScrollbarTrack) {
    const scrollProperty: string = track === 'vertical' ? 'scrollTop' : 'scrollLeft';
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
    let verticalUsed: boolean = false;
    let horizontalUsed: boolean = false;
    let isVerticallyScrollable: boolean = false;
    let isHorizontallyScrollable: boolean = false;

    /** Check if vertical scrollbar should be displayed */
    if (this.track === 'all' || this.track === 'vertical') {
      isVerticallyScrollable = this.viewport.scrollHeight > this.viewport.clientHeight;
      verticalUsed = this.visibility === 'always' || isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
    if (this.track === 'all' || this.track === 'horizontal') {
      isHorizontallyScrollable = this.viewport.scrollWidth > this.viewport.clientWidth;
      horizontalUsed = this.visibility === 'always' || isHorizontallyScrollable;
    }

    this._updateState({
      position: this.position,
      track: this.track,
      appearance: this.appearance,
      visibility: this.visibility,
      disabled: this.disabled,
      dir: this.dir.value,
      verticalUsed,
      horizontalUsed,
      isVerticallyScrollable,
      isHorizontallyScrollable
    });
  }

  private _updateState(state: NgScrollbarState) {
    this.state = { ...this.state, ...state };
    this.changeDetectorRef.detectChanges();
  }

  setHovered(hovered: ScrollbarHovered) {
    this.zone.run(() => this._updateState({ ...hovered }));
  }

  setDragging(dragging: ScrollbarDragging) {
    this.zone.run(() => this._updateState({ ...dragging }));
  }

  private activateViewport() {
    if (this.customViewPort) {
      // Set the custom viewport and the viewport
      this.viewport = this.customViewPort.viewPort.nativeElement;
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
    }

    // Check if the custom viewport has only one child and set it as the content wrapper
    if (this.viewport.children.length === 1) {
      this.contentWrapper = this.viewport.firstElementChild as HTMLElement;
      this.contentWrapper.classList.add('ng-scroll-content');
    }
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.activateViewport();

      // Initialize scroll streams
      this.scrolled = new Observable((observer: Observer<any>) =>
        fromEvent(this.viewport, 'scroll', { passive: true }).pipe(takeUntil(this.destroyed))
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


interface ScrollbarDragging {
  verticalDragging?: boolean;
  horizontalDragging?: boolean;
}

interface ScrollbarHovered {
  verticalHovered?: boolean;
  horizontalHovered?: boolean;
}
