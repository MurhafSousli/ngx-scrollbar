import { AfterViewInit, OnDestroy, Input, ViewChild, NgZone, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, throttleTime, tap } from 'rxjs/operators';
import { NgScrollbar } from './ng-scrollbar';

export class NgScrollbarThumb implements AfterViewInit, OnDestroy {

  /** Scrollbar class */
  @Input() barClass: string;
  /** Scrollbar thumbnail class */
  @Input() thumbClass: string;
  /** The scroll duration when scrollbar (not the thumbnail) is clicked */
  @Input() scrollToDuration: number;

  @ViewChild('bar', { static: true }) bar: ElementRef;
  @ViewChild('thumb', { static: true }) thumb: ElementRef;

  protected _minThumbSize = 20;
  protected _naturalThumbSize = 0;
  protected _thumbSize = 0;
  protected _trackMax = 0;
  protected _scrollMax = 0;
  protected _currPos = 0;
  protected _scroll$ = Subscription.EMPTY;
  protected _thumbDrag$ = Subscription.EMPTY;
  protected _updateObserver$ = Subscription.EMPTY;
  protected _view: HTMLElement;
  protected _state = new BehaviorSubject<any>({
    transform: 'translate3d(0, 0, 0)'
  });

  /** Scrollbar styles */
  readonly scrollbarStyle = this._state.asObservable();

  get thumbSize(): number {
    return 0;
  }

  constructor(protected _parent: NgScrollbar,
              protected _platform: Object,
              protected _zone: NgZone) {
  }

  ngAfterViewInit() {
    // Avoid SSR Error
    if (isPlatformBrowser(this._platform)) {
      this._view = this._parent.view;
      // Start view scroll event
      this._scroll$ = this._parent.scrollable.elementScrolled()
        .subscribe(() => this.updateScrollbar());

      // Start scrollbar thumbnail drag events
      this._zone.runOutsideAngular(() =>
        this._thumbDrag$ = this.startThumbEvents().subscribe()
      );

      // Update scrollbar thumbnail size on content changes
      this._updateObserver$ = this._parent.updateObserver.pipe(
        throttleTime(200),
        tap(() => this.updateScrollbar()),
        // Make sure scrollbar thumbnail position is correct after the new content is rendered
        debounceTime(200),
        tap(() => this.updateScrollbar()),
      ).subscribe();

      // Initialize scrollbar
      setTimeout(() => this.updateScrollbar(), 200);
    }
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
  onScrollbarHolderClick(e: any) {
  }

  /**
   * Update scrollbar
   */
  protected updateScrollbar() {
  }

  /**
   * Start vertical thumb worker
   */
  protected startThumbEvents(): Observable<any> | undefined {
    return undefined;
  }

  /**
   * Get scrollbar thumb size
   * @param naturalThumbSize
   * @param scrollMax
   */
  protected scrollBoundaries(naturalThumbSize: number, scrollMax: number): number {
    return (naturalThumbSize < this._minThumbSize) ? this._minThumbSize : scrollMax ? naturalThumbSize : 0;
  }

  protected updateState(state: any) {
    this._state.next({...this._state.value, ...state});
  }
}
