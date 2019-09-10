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
import { ScrollbarAppearance, ScrollbarTrack, ScrollbarPosition, ScrollbarVisibility, NgScrollbarState } from './ng-scrollbar.model';
import { ScrollbarManager } from './utils/scrollbar-manager';
import { NativeScrollbarSizeFactory } from './utils/native-scrollbar-size-factory';

@Component({
  selector: 'ng-scrollbar',
  exportAs: 'ngScrollbar',
  templateUrl: 'ng-scrollbar.html',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.ng-scrollbar]': 'true' }
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
  /** Minimum scrollbar thumb size */
  @Input() minThumbSize: number = this.manager.globalOptions.minThumbSize;
  /** The duration which the scrolling takes to reach its target when scrollbar rail is clicked */
  @Input() trackClickScrollDuration = this.manager.globalOptions.trackClickScrollDuration;
  /** A flag used to enable/disable the scrollbar track clicked event */
  @Input() trackClickDisabled: boolean = this.manager.globalOptions.trackClickDisabled;
  /** A flag used to enable/disable the scrollbar thumb dragged event */
  @Input() thumbDragDisabled: boolean = this.manager.globalOptions.thumbDragDisabled;
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
  /** Set of attributes added on the scrollbar wrapper */
  state: NgScrollbarState = {};
  /** Stream that destroys components' observables */
  private destroyed = new Subject<void>();

  constructor(private el: ElementRef,
              private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              private dir: Directionality,
              private smoothScroll: SmoothScrollManager,
              public manager: ScrollbarManager,
              public nativeScrollbarSizeFactory: NativeScrollbarSizeFactory) {
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

  /**
   * Set the viewport based on user choice
   */
  private setViewport() {
    if (this.customViewPort) {
      // Set the custom viewport as the scroll viewport
      this.viewport = this.customViewPort.viewPort.nativeElement;
      // In this case the default viewport and the default content wrapper will act as a mask
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
    if (this.viewport.firstElementChild) {
      this.contentWrapper = this.viewport.firstElementChild as HTMLElement;
      this.contentWrapper.classList.add('ng-scroll-content');
    }
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.setViewport();

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
    return this.smoothScroll.scrollTo(this.viewport, options);
  }

  /**
   * Scroll to element by reference or selector
   */
  scrollToElement(target: SmoothScrollElement, options?): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport, target, options);
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
