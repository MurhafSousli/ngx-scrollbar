import {
  Component,
  Input,
  Output,
  ViewChild,
  ContentChild,
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
import { SmoothScrollElement, SmoothScrollManager, SmoothScrollToOptions } from 'ngx-scrollbar/smooth-scroll';
// Uncomment the following line in development mode
// import { SmoothScrollElement, SmoothScrollManager, SmoothScrollToOptions } from '../../smooth-scroll/src/public_api';
import {
  ScrollbarAppearance,
  ScrollbarTrack,
  ScrollbarPosition,
  ScrollbarVisibility,
  NgScrollbarState,
  ScrollbarPointerEventsMethod
} from './ng-scrollbar.model';
import { ScrollbarManager } from './utils/scrollbar-manager';
import { NativeScrollbarSizeFactory } from './utils/native-scrollbar-size-factory';

@Component({
  selector: 'ng-scrollbar',
  exportAs: 'ngScrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss', 'scrollbar/shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.ng-scrollbar]': 'true' }
})
export class NgScrollbar implements OnInit, AfterViewChecked, OnDestroy {
  /** A class forwarded to scrollable viewport element */
  @Input() viewClass: string = this.manager.globalOptions.viewClass;
  /** A class forwarded to the scrollbar track element */
  @Input() trackClass: string = this.manager.globalOptions.trackClass;
  /** A class forwarded to the scrollbar thumb element */
  @Input() thumbClass: string = this.manager.globalOptions.thumbClass;
  /** Minimum scrollbar thumb size */
  @Input() minThumbSize: number = this.manager.globalOptions.minThumbSize;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  @Input() trackClickScrollDuration = this.manager.globalOptions.trackClickScrollDuration;
  /** A flag used to enable/disable the scrollbar thumb dragged event */
  @Input() pointerEventsDisabled: boolean = this.manager.globalOptions.pointerEventsDisabled;
  /**
   * Sets the pointer events method
   * Use viewport pointer events  to handle dragging and track click (This makes scrolling work when mouse is over the scrollbar)
   * Use scrollbar pointer events to handle dragging and track click
   */
  @Input() pointerEventsMethod: ScrollbarPointerEventsMethod = this.manager.globalOptions.pointerEventsMethod;
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
  /** Debounce interval for detecting changes via ResizeObserver */
  @Input() sensorDebounce: number = this.manager.globalOptions.sensorDebounce;
  /** Whether ResizeObserver is disabled */
  @Input() sensorDisabled: boolean = this.manager.globalOptions.sensorDisabled;
  /** Steam that emits when scrollbar is updated */
  @Output() updated = new EventEmitter<void>();
  /** Default viewport reference */
  @ViewChild(ScrollViewport, { static: true }) private defaultViewPort: ScrollViewport;
  /** Custom viewport reference */
  @ContentChild(ScrollViewport, { static: true }) private customViewPort: ScrollViewport;
  /** Viewport Element */
  viewport: ScrollViewport;
  /** Set of attributes added on the scrollbar wrapper */
  state: NgScrollbarState = {};
  /** Stream that destroys components' observables */
  private destroyed = new Subject<void>();

  /** Stream that emits on scroll event */
  scrolled: Observable<any>;
  /** Steam that emits scroll event for vertical scrollbar */
  verticalScrolled: Observable<any>;
  /** Steam that emits scroll event for horizontal scrollbar */
  horizontalScrolled: Observable<any>;

  get nativeElement(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private dir: Directionality,
    private smoothScroll: SmoothScrollManager,
    public manager: ScrollbarManager,
    public nativeScrollbarSizeFactory: NativeScrollbarSizeFactory) {
  }

  /**
   * Update local state with each change detection
   */
  private updateState() {
    let verticalUsed: boolean = false;
    let horizontalUsed: boolean = false;
    let isVerticallyScrollable: boolean = false;
    let isHorizontallyScrollable: boolean = false;

    // Check if vertical scrollbar should be displayed
    if (this.track === 'all' || this.track === 'vertical') {
      isVerticallyScrollable = this.viewport.scrollHeight > this.viewport.clientHeight;
      verticalUsed = this.visibility === 'always' || isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
    if (this.track === 'all' || this.track === 'horizontal') {
      isHorizontallyScrollable = this.viewport.scrollWidth > this.viewport.clientWidth;
      horizontalUsed = this.visibility === 'always' || isHorizontallyScrollable;
    }

    // Update inner wrapper attributes
    this._updateState({
      position: this.position,
      track: this.track,
      appearance: this.appearance,
      visibility: this.visibility,
      deactivated: this.disabled,
      dir: this.dir.value,
      pointerEventsMethod: this.pointerEventsMethod,
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

  private getScrolledByDirection(property: 'scrollLeft' | 'scrollTop') {
    let event: any;
    return this.scrolled.pipe(
      tap((e: any) => event = e),
      pluck('target', property),
      pairwise(),
      filter(([prev, curr]) => prev !== curr),
      map(() => event)
    );
  }

  /**
   * Set hovered state if a scrollbar is being hovered
   */
  setHovered(hovered: ScrollbarHovered) {
    this.zone.run(() => this._updateState({ ...hovered }));
  }

  /**
   * Set dragging state if a scrollbar is being dragged
   */
  setDragging(dragging: ScrollbarDragging) {
    this.zone.run(() => this._updateState({ ...dragging }));
  }

  ngOnInit() {
    // Set the viewport based on user choice
    this.zone.runOutsideAngular(() => {
      if (this.customViewPort) {
        this.viewport = this.customViewPort;
        this.defaultViewPort.setAsWrapper();
      } else {
        this.viewport = this.defaultViewPort;
      }
      // Activate the selected viewport
      this.viewport.setAsViewport(this.viewClass);

      // Initialize scroll streams
      this.scrolled = new Observable((observer: Observer<any>) =>
        fromEvent(this.viewport.nativeElement, 'scroll', { passive: true }).pipe(takeUntil(this.destroyed))
          .subscribe(observer));
      this.verticalScrolled = this.getScrolledByDirection('scrollTop');
      this.horizontalScrolled = this.getScrolledByDirection('scrollLeft');
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
   * Update local state and the internal scrollbar controls
   */
  update() {
    this.updated.next();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Smooth scroll functions
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.viewport.nativeElement, options);
  }

  /**
   * Scroll to element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport.nativeElement, target, options);
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
