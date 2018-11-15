import {
  Component,
  Inject,
  AfterViewInit,
  OnDestroy,
  Input,
  ViewChild,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable, BehaviorSubject, Subscription, SubscriptionLike, animationFrameScheduler } from 'rxjs';
import { debounceTime, throttleTime, mergeMap, pluck, takeUntil, tap } from 'rxjs/operators';
import { NgScrollbar } from './ng-scrollbar';

interface AxisProperties {
  offsetYOrX: string;
  scrollTopLeft: string;
  clientYOrX: string;
  topOrLeft: string;
  clientHeightOrWidth: string;
  scrollHeightOrWidth: string;
  heightOrWidth: string;
  transform: (val: number) => string;
}

interface Axis {
  vertical: AxisProperties;
  horizontal: AxisProperties;
}

const axis: Axis = {
  vertical: {
    topOrLeft: 'top',
    offsetYOrX: 'offsetY',
    clientYOrX: 'clientY',
    heightOrWidth: 'height',
    scrollTopLeft: 'scrollTop',
    clientHeightOrWidth: 'clientHeight',
    scrollHeightOrWidth: 'scrollHeight',
    transform: (val: number) => `translate3d(0, ${val}px, 0)`
  },
  horizontal: {
    topOrLeft: 'left',
    offsetYOrX: 'offsetX',
    clientYOrX: 'clientX',
    heightOrWidth: 'width',
    scrollTopLeft: 'scrollLeft',
    clientHeightOrWidth: 'clientWidth',
    scrollHeightOrWidth: 'scrollWidth',
    transform: (val: number) => `translate3d(${val}px, 0, 0)`
  }
};

@Component({
  selector: 'ng-scrollbar-thumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #bar class="ng-scrollbar ng-scrollbar-{{orientation}} {{barClass}}" (mousedown)="onScrollbarClick($event)">
      <div #thumb class="ng-scrollbar-thumb {{thumbClass}}" [ngStyle]="scrollbarStyle | async"></div>
    </div>
  `
})
export class NgScrollbarThumb implements AfterViewInit, OnDestroy {

  /** Scrollbar class */
  @Input() barClass: string;
  /** Scrollbar thumbnail class */
  @Input() thumbClass: string;
  /** The scroll duration when scrollbar (not the thumbnail) is clicked */
  @Input() scrollToDuration: number;
  /** Scrollbar orientation */
  @Input() orientation: 'vertical' | 'horizontal';

  @ViewChild('bar') bar: ElementRef;
  @ViewChild('thumb') thumb: ElementRef;

  private _minThumbSize = 20;
  private _naturalThumbSize = 0;
  private _thumbSize = 0;
  private _trackMax = 0;
  private _scrollMax = 0;
  private _currPos = 0;
  private _scroll$: SubscriptionLike = Subscription.EMPTY;
  private _thumbDrag$: SubscriptionLike = Subscription.EMPTY;
  private _updateObserver$: SubscriptionLike = Subscription.EMPTY;
  private _view: HTMLElement;
  private _state = new BehaviorSubject<any>({
    transform: 'translate3d(0, 0, 0)'
  });

  /** Scrollbar styles */
  scrollbarStyle = this._state.asObservable();

  /**
   * Get the proper properties for scrollbar orientation
   */
  get axis(): AxisProperties {
    return axis[this.orientation];
  }

  /**
   * Calculate scrollbar thumbnail size
   */
  get thumbSize(): number {
    const scrollBarClientHeightOrWidth = this.bar.nativeElement[this.axis.clientHeightOrWidth];
    const viewClientHeightOrWidth = this._view[this.axis.clientHeightOrWidth];
    const viewScrollHeightOrWidth = this._view[this.axis.scrollHeightOrWidth];
    this._naturalThumbSize = scrollBarClientHeightOrWidth / viewScrollHeightOrWidth * scrollBarClientHeightOrWidth;
    this._scrollMax = viewScrollHeightOrWidth - viewClientHeightOrWidth;
    return this.scrollBoundaries(this._naturalThumbSize, this._scrollMax);
  }

  constructor(private zone: NgZone,
              @Inject(DOCUMENT) private document: any,
              @Inject(forwardRef(() => NgScrollbar)) private ngScrollbar: NgScrollbar) {
  }

  ngAfterViewInit() {
    this._view = this.ngScrollbar.scrollable.getElementRef().nativeElement;
    // Start view scroll event
    this._scroll$ = this.ngScrollbar.scrollable.elementScrolled()
      .subscribe(() => this.updateScrollbar());

    // Start scrollbar thumbnail drag events
    this.zone.runOutsideAngular(() =>
      this._thumbDrag$ = this.startThumbEvents().subscribe()
    );

    // Update scrollbar thumbnail size on content changes
    this._updateObserver$ = this.ngScrollbar.updateObserver.pipe(
      throttleTime(200),
      tap(() => this.updateScrollbar()),
      // Make sure scrollbar thumbnail position is correct after the new content is rendered
      debounceTime(200),
      tap(() => this.updateScrollbar()),
    ).subscribe();

    // Initialize scrollbar
    setTimeout(() => this.updateScrollbar(), 200);
  }

  ngOnDestroy() {
    this._scroll$.unsubscribe();
    this._thumbDrag$.unsubscribe();
    this._updateObserver$.unsubscribe();
  }

  /**
   * Scrollbar click
   * @param e Mouse event
   */
  onScrollbarClick(e: any) {
    if (e.target === e.currentTarget) {
      const offsetYOrX = e[this.axis.offsetYOrX] - this._naturalThumbSize * .5;
      const thumbPositionPercentage = offsetYOrX * 100 / this.bar.nativeElement[this.axis.clientHeightOrWidth];
      const value = thumbPositionPercentage * this._view[this.axis.scrollHeightOrWidth] / 100;
      this.ngScrollbar.scrollTo({[this.axis.topOrLeft]: value, duration: this.scrollToDuration} as any).subscribe();
    }
  }

  /**
   * Update scrollbar
   */
  private updateScrollbar() {
    this._thumbSize = this.thumb.nativeElement[this.axis.clientHeightOrWidth];
    this._trackMax = this.bar.nativeElement[this.axis.clientHeightOrWidth] - this._thumbSize;
    this._currPos = this._view[this.axis.scrollTopLeft] * this._trackMax / this._scrollMax;
    this.zone.run(() =>
      animationFrameScheduler.schedule(() =>
        this.updateState({
          transform: this.axis.transform(this._currPos),
          [this.axis.heightOrWidth]: `${this.thumbSize}px`
        })
      )
    );
  }

  /**
   * Start vertical thumb worker
   */
  private startThumbEvents(): Observable<any> {
    const mouseDown$ = fromEvent(this.thumb.nativeElement, 'mousedown');
    const mouseMove$ = fromEvent(this.document, 'mousemove');
    const mouseUp$ = fromEvent(this.document, 'mouseup').pipe(
      tap(() => this.document.onselectstart = null)
    );
    return mouseDown$.pipe(
      tap(() => {
        this.document.onselectstart = () => false;
        // Initialize trackMax for before start dragging
        this._trackMax = this.bar.nativeElement[this.axis.clientHeightOrWidth] - this._thumbSize;
      }),
      pluck(this.axis.offsetYOrX),
      mergeMap((mouseDownOffset: number) => mouseMove$.pipe(
        takeUntil(mouseUp$),
        pluck(this.axis.clientYOrX),
        tap((mouseMoveClient: number) => {
          const offsetYOrX = mouseMoveClient - this.bar.nativeElement.getBoundingClientRect()[this.axis.topOrLeft];
          const value = this._scrollMax * (offsetYOrX - mouseDownOffset) / this._trackMax;
          this.ngScrollbar.scrollable.scrollTo({[this.axis.topOrLeft]: value});
        })
      ))
    );
  }

  /**
   * Get scrollbar thumb size
   * @param naturalThumbSize
   * @param scrollMax
   */
  private scrollBoundaries(naturalThumbSize: number, scrollMax: number): number {
    return (naturalThumbSize < this._minThumbSize) ? this._minThumbSize : scrollMax ? naturalThumbSize : 0;
  }

  private updateState(state: any) {
    this._state.next({...this._state.value, ...state});
  }
}
