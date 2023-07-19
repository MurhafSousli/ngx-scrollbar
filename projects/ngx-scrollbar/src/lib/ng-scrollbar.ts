import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ContentChild,
  OnInit,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  NgZone,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable, Subject, fromEvent, auditTime, filter, map, pairwise, takeUntil, tap } from 'rxjs';
import { NgAttr } from './utils/ng-attr.directive';
import { ScrollViewport } from './scroll-viewport';
import { ScrollbarX, ScrollbarY } from './scrollbar/scrollbar.component';
import { HideNativeScrollbar } from './hide-native-scrollbar/hide-native-scrollbar';
import { ResizeSensor } from './resize-sensor/resize-sensor.directive';
import { SmoothScrollElement, SmoothScrollManager, SmoothScrollToOptions, SmoothScrollToElementOptions } from 'ngx-scrollbar/smooth-scroll';
import { ScrollbarManager } from './utils/scrollbar-manager';
import { NgScrollbarBase, ScrollbarDragging, ScrollbarHovered } from './ng-scrollbar-base';
import {
  ScrollbarAppearance,
  ScrollbarTrack,
  ScrollbarPosition,
  ScrollbarVisibility,
  NgScrollbarState,
  ScrollbarPointerEventsMethod
} from './ng-scrollbar.model';

@Component({
  selector: 'ng-scrollbar',
  exportAs: 'ngScrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss', 'scrollbar/shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.ng-scrollbar]': 'true' },
  providers: [{ provide: NgScrollbarBase, useExisting: NgScrollbar }],
  standalone: true,
  imports: [NgIf, NgAttr, ResizeSensor, ScrollViewport, HideNativeScrollbar, ScrollbarX, ScrollbarY]
})
export class NgScrollbar implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  private _disabled: boolean = false;
  private _sensorDisabled: boolean = this.manager.globalOptions.sensorDisabled;
  private _pointerEventsDisabled: boolean = this.manager.globalOptions.pointerEventsDisabled;
  private _autoHeightDisabled: boolean = this.manager.globalOptions.autoHeightDisabled;
  private _autoWidthDisabled: boolean = this.manager.globalOptions.autoWidthDisabled;
  private _viewportPropagateMouseMove: boolean = this.manager.globalOptions.viewportPropagateMouseMove;

  /** Disable custom scrollbar and switch back to native scrollbar */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(disabled: boolean | string) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  /** Whether ResizeObserver is disabled */
  @Input()
  get sensorDisabled(): boolean {
    return this._sensorDisabled;
  }

  set sensorDisabled(disabled: boolean | string) {
    this._sensorDisabled = coerceBooleanProperty(disabled);
  }

  /** A flag used to enable/disable the scrollbar thumb dragged event */
  @Input()
  get pointerEventsDisabled(): boolean {
    return this._pointerEventsDisabled;
  }

  set pointerEventsDisabled(disabled: boolean | string) {
    this._pointerEventsDisabled = coerceBooleanProperty(disabled);
  }

  /** Enable viewport mousemove event propagation (only when pointerEventsMethod="viewport") */
  @Input()
  get viewportPropagateMouseMove(): boolean {
    return this._viewportPropagateMouseMove;
  }

  set viewportPropagateMouseMove(disabled: boolean | string) {
    this._viewportPropagateMouseMove = coerceBooleanProperty(disabled);
  }

  /** Disable auto-height */
  @Input()
  get autoHeightDisabled(): boolean {
    return this._autoHeightDisabled;
  }

  set autoHeightDisabled(disabled: boolean | string) {
    this._autoHeightDisabled = coerceBooleanProperty(disabled);
  }

  /** Disable auto-width */
  @Input()
  get autoWidthDisabled(): boolean {
    return this._autoWidthDisabled;
  }

  set autoWidthDisabled(disabled: boolean | string) {
    this._autoWidthDisabled = coerceBooleanProperty(disabled);
  }

  /** A class forwarded to scrollable viewport element */
  @Input() viewClass: string = this.manager.globalOptions.viewClass;
  /** A class forwarded to the scrollbar track element */
  @Input() trackClass: string = this.manager.globalOptions.trackClass;
  /** A class forwarded to the scrollbar thumb element */
  @Input() thumbClass: string = this.manager.globalOptions.thumbClass;
  /** Minimum scrollbar thumb size */
  @Input() minThumbSize: number = this.manager.globalOptions.minThumbSize;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  @Input() trackClickScrollDuration: number = this.manager.globalOptions.trackClickScrollDuration;
  /**
   * Sets the pointer events method
   * Use viewport pointer events  to handle dragging and track click (This makes scrolling work when mouse is over the scrollbar)
   * Use scrollbar pointer events to handle dragging and track click
   */
  @Input() pointerEventsMethod: ScrollbarPointerEventsMethod = this.manager.globalOptions.pointerEventsMethod;
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
  /** Scroll Audit Time */
  @Input() scrollAuditTime: number = this.manager.globalOptions.scrollAuditTime;

  /** Steam that emits when scrollbar is updated */
  @Output() updated = new EventEmitter<void>();

  /** Vertical scrollbar ElementRef used for include its thickness in auto-width mode */
  @ViewChild('scrollbarY', { read: ElementRef }) private scrollbarY!: ElementRef;
  /** Horizontal scrollbar ElementRef used for include its thickness in auto-height mode */
  @ViewChild('scrollbarX', { read: ElementRef }) private scrollbarX!: ElementRef;

  /** Default viewport reference */
  @ViewChild(ScrollViewport, { static: true }) private defaultViewPort!: ScrollViewport;
  /** Custom viewport reference */
  @ContentChild(ScrollViewport, { static: true }) private customViewPort!: ScrollViewport;
  /** Viewport Element */
  viewport!: ScrollViewport;
  /** Set of attributes added on the scrollbar wrapper */
  state: NgScrollbarState = {};
  /** Stream that destroys components' observables */
  private readonly destroyed = new Subject<void>();

  /** Stream that emits on scroll event */
  scrolled!: Observable<Event>;
  /** Steam that emits scroll event for vertical scrollbar */
  verticalScrolled!: Observable<Event>;
  /** Steam that emits scroll event for horizontal scrollbar */
  horizontalScrolled!: Observable<Event>;

  get nativeElement(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private dir: Directionality,
    private smoothScroll: SmoothScrollManager,
    public manager: ScrollbarManager) {
  }

  /**
   * Update local state with each change detection
   */
  private updateState(): void {
    let verticalUsed: boolean = false;
    let horizontalUsed: boolean = false;
    let isVerticallyScrollable: boolean = false;
    let isHorizontallyScrollable: boolean = false;

    // Check if vertical scrollbar should be displayed
    if (this.track === 'all' || this.track === 'vertical') {
      isVerticallyScrollable = this.viewport!.scrollHeight > this.viewport!.clientHeight;
      verticalUsed = this.visibility === 'always' || isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
    if (this.track === 'all' || this.track === 'horizontal') {
      isHorizontallyScrollable = this.viewport!.scrollWidth > this.viewport!.clientWidth;
      horizontalUsed = this.visibility === 'always' || isHorizontallyScrollable;
    }

    // Update inner wrapper attributes
    this.setState({
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

  private setState(state: NgScrollbarState): void {
    this.state = { ...this.state, ...state };
    this.changeDetectorRef.detectChanges();
  }

  private getScrolledByDirection(property: 'scrollLeft' | 'scrollTop'): Observable<Event> {
    let event: Event;
    return this.scrolled!.pipe(
      tap((e: Event) => event = e),
      map((e: Event) => e.target[property]),
      pairwise(),
      filter(([prev, curr]: [Event, Event]) => prev !== curr),
      map(() => event)
    );
  }

  /**
   * Set hovered state if a scrollbar is being hovered
   */
  setHovered(hovered: ScrollbarHovered): void {
    this.zone.run(() => this.setState({ ...hovered }));
  }

  /**
   * Set dragging state if a scrollbar is being dragged
   */
  setDragging(dragging: ScrollbarDragging): void {
    this.zone.run(() => this.setState({ ...dragging }));
  }

  /**
   * Set clicked state if a scrollbar track is being clicked
   */
  setClicked(scrollbarClicked: boolean): void {
    this.zone.run(() => this.setState({ scrollbarClicked }));
  }

  ngOnInit(): void {
    // Set the viewport based on user choice
    this.zone.runOutsideAngular(() => {
      if (this.customViewPort) {
        this.viewport = this.customViewPort;
        this.defaultViewPort!.setAsWrapper();
      } else {
        this.viewport = this.defaultViewPort;
      }
      // Activate the selected viewport
      this.viewport!.setAsViewport(this.viewClass!);

      let scrollStream = fromEvent<Event>(this.viewport!.nativeElement, 'scroll', { passive: true });
      // Throttle scroll event if 'scrollAuditTime' is set
      scrollStream = this.scrollAuditTime ? scrollStream.pipe(auditTime(this.scrollAuditTime)) : scrollStream;
      // Initialize scroll streams
      this.scrolled = scrollStream.pipe(takeUntil(this.destroyed));
      this.verticalScrolled = this.getScrolledByDirection('scrollTop');
      this.horizontalScrolled = this.getScrolledByDirection('scrollLeft');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update only when the viewport is initialized
    if (this.viewport) {
      this.update();
    }
  }

  ngAfterViewInit(): void {
    // Initial update
    this.update();

    // Update on dir changes
    this.dir.change.pipe(
      tap(() => this.update()),
      takeUntil(this.destroyed)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /**
   * Update local state and the internal scrollbar controls
   */
  update(): void {
    if (!this.autoHeightDisabled) {
      this.updateHeight();
    }

    if (!this.autoWidthDisabled) {
      this.updateWidth();
    }
    // Re-evaluate the state after setting height or width
    this.updateState();
    this.updated.next();
  }

  /**
   * Smooth scroll functions
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.viewport!.nativeElement, options);
  }

  /**
   * Scroll to element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport!.nativeElement, target, options);
  }

  private updateHeight(): void {
    // Auto-height: Set component height to content height
    if (this.appearance === 'standard' && this.scrollbarX) {
      // if scrollbar-x is displayed in standard mode
      this.nativeElement.style.height = `${ this.viewport!.contentHeight + this.scrollbarX.nativeElement.clientHeight }px`;
    } else {
      this.nativeElement.style.height = `${ this.viewport!.contentHeight }px`;
    }
  }

  private updateWidth(): void {
    // Auto-width: Set component minWidth to content width
    if (this.appearance === 'standard' && this.scrollbarY) {
      // if scrollbar-y is displayed in standard mode
      this.nativeElement.style.width = `${ this.viewport!.contentWidth + this.scrollbarY.nativeElement.clientWidth }px`;
    } else {
      this.nativeElement.style.width = `${ this.viewport!.contentWidth }px`;
    }
  }
}
