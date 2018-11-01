import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  ViewChild,
  HostBinding,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable, BehaviorSubject, Subscription, SubscriptionLike } from 'rxjs';
import { mergeMap, pluck, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { NgScrollbar } from './ng-scrollbar';

interface AxisProperties {
  offset: string;
  scroll: string;
  client: string;
  position: string;
  clientSize: string;
  scrollSize: string;
  thumbnailSize: string;
  transform: (val: number) => string;
}

interface Axis {
  vertical: AxisProperties;
  horizontal: AxisProperties;
}

const axis: Axis = {
  vertical: {
    position: 'top',
    offset: 'offsetY',
    client: 'clientY',
    scroll: 'scrollTop',
    clientSize: 'clientHeight',
    scrollSize: 'scrollHeight',
    thumbnailSize: 'height',
    transform: (val: number) => `translate3d(0, ${val}px, 0)`
  },
  horizontal: {
    position: 'left',
    offset: 'offsetX',
    client: 'clientX',
    scroll: 'scrollLeft',
    clientSize: 'clientWidth',
    scrollSize: 'scrollWidth',
    thumbnailSize: 'width',
    transform: (val: number) => `translate3d(${val}px, 0, 0)`
  }
};

@Component({
  selector: 'ng-scrollbar-thumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #bar class="ng-scrollbar ng-scrollbar-{{orientation}} {{barClass}}" (mousedown)="onMouseDown($event)">
      <div #thumb class="ng-scrollbar-thumb {{thumbClass}}" [ngStyle]="scrollbarStyle | async"></div>
    </div>
  `
})
export class NgScrollbarThumb implements OnInit, AfterViewInit, OnDestroy {

  @Input() barClass: string;
  @Input() thumbClass: string;
  @Input() scrollToDuration: number;
  @Input() orientation: 'vertical' | 'horizontal';

  @ViewChild('bar') bar: ElementRef;
  @ViewChild('thumb') thumb: ElementRef;
  @HostBinding('class.ng-scrollbar-visible') get visibility(): boolean {
    return !!this._scrollMax;
  }

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
    const scrollBarClientSize = this.bar.nativeElement[this.axis.clientSize];
    const viewClientSize = this._view[this.axis.clientSize];
    const viewScrollSize = this._view[this.axis.scrollSize];
    this._naturalThumbSize = scrollBarClientSize / viewScrollSize * scrollBarClientSize;
    this._scrollMax = viewScrollSize - viewClientSize;
    return this.scrollBoundaries(this._naturalThumbSize, this._scrollMax);
  }

  constructor(private zone: NgZone,
              @Inject(DOCUMENT) private document: any,
              @Inject(forwardRef(() => NgScrollbar)) private ngScrollbar: NgScrollbar) {
  }

  ngOnInit() {
    this._view = this.ngScrollbar.scrollable.getElementRef().nativeElement;
  }

  ngAfterViewInit() {
    // Initialize trackMax to activate scrollbar thumbnail drag event
    this._trackMax = this.bar.nativeElement[this.axis.clientSize] - this._thumbSize;

    // Start view scroll event
    this._scroll$ = this.ngScrollbar.scrollable.elementScrolled().subscribe(() => this.updateThumbsPosition());

    // Start scrollbar thumbnail drag events
    this.zone.runOutsideAngular(() =>
      this._thumbDrag$ = this.startThumbEvents().subscribe()
    );

    // Update scrollbar thumbnail size on content changes
    this._updateObserver$ = this.ngScrollbar.updateObserver.pipe(
      throttleTime(200),
      tap(() => this.updateThumbsPosition())
    ).subscribe();

    // Initialize scrollbar thumbnail size
    this.initScrollbarThumbSize();
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
  onMouseDown(e: any) {
    if (e.target === e.currentTarget) {
      const offset = e[this.axis.offset] - this._naturalThumbSize * .5;
      const thumbPositionPercentage = offset * 100 / this.bar.nativeElement[this.axis.clientSize];
      const value = thumbPositionPercentage * this._view[this.axis.scrollSize] / 100;
      this.ngScrollbar.scrollTo({[this.axis.position]: value, duration: this.scrollToDuration} as any).subscribe();
    }
  }

  /**
   * Update scrollbars thumbnails position
   */
  private updateThumbsPosition() {
    this._thumbSize = this.thumb.nativeElement[this.axis.clientSize];
    this._trackMax = this.bar.nativeElement[this.axis.clientSize] - this._thumbSize;
    this._currPos = this._view[this.axis.scroll] * this._trackMax / this._scrollMax;
    this.zone.run(() =>
      this.updateState({
        transform: this.axis.transform(this._currPos),
        [this.axis.thumbnailSize]: `${this.thumbSize}px`
      })
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
      tap(() => this.document.onselectstart = () => false),
      pluck(this.axis.offset),
      mergeMap((mouseDownOffset: number) => mouseMove$.pipe(
        takeUntil(mouseUp$),
        pluck(this.axis.client),
        tap((mouseMoveClient: number) => {
          const offset = mouseMoveClient - this.bar.nativeElement.getBoundingClientRect()[this.axis.position];
          const value = this._scrollMax * (offset - mouseDownOffset) / this._trackMax;
          this.ngScrollbar.scrollable.scrollTo({[this.axis.position]: value});
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

  /**
   * Initialize scrollbar thumbnail size
   */
  private initScrollbarThumbSize() {
    this.updateState({[this.axis.thumbnailSize]: `${this.thumbSize}px`});
    // Update state again to fix wrong size in Firefox
    setTimeout(() => this.updateState({[this.axis.thumbnailSize]: `${this.thumbSize}px`}), 200);
    // Sometimes firefox needs more than 200ms, update one more time to ensure the size is correct
    setTimeout(() => this.updateState({[this.axis.thumbnailSize]: `${this.thumbSize}px`}), 500);
  }

  private updateState(state: any) {
    this._state.next({...this._state.value, ...state});
  }
}
