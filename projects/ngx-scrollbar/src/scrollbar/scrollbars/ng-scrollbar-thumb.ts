import { AfterViewInit, OnDestroy, Input, ViewChild, NgZone, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, throttleTime, tap } from 'rxjs/operators';
import { NgScrollbar } from '../ng-scrollbar';

export class NgScrollbarThumb implements AfterViewInit, OnDestroy {

  /** Scrollbar class */
  @Input() barClass: string;
  /** Scrollbar thumbnail class */
  @Input() thumbClass: string;

  @ViewChild('bar') bar: ElementRef;
  @ViewChild('thumb') thumb: ElementRef;

  protected minThumbSize = 20;
  protected naturalThumbSize = 0;
  protected thumbSize = 0;
  protected trackMax = 0;
  protected scrollMax = 0;
  protected currPos = 0;
  protected scroll$ = Subscription.EMPTY;
  protected thumbDrag$ = Subscription.EMPTY;
  protected updateObserver$ = Subscription.EMPTY;
  protected view: HTMLElement;
  protected state = new BehaviorSubject<any>({
    transform: 'translate3d(0, 0, 0)'
  });

  /** Scrollbar styles */
  readonly scrollbarStyle = this.state.asObservable();

  get thumbnailSize(): number {
    return 0;
  }

  constructor(protected parent: NgScrollbar,
              protected platform: Object,
              protected zone: NgZone) {
  }

  ngAfterViewInit() {
    // Avoid SSR Error
    if (isPlatformBrowser(this.platform)) {
      this.view = this.parent.view;

      this.listenToScrollEvent();

      // Start scrollbar thumbnail drag events
      this.zone.runOutsideAngular(() =>
        this.thumbDrag$ = this.startThumbEvents().subscribe()
      );

      // Update scrollbar thumbnail size on content changes
      this.updateObserver$ = this.parent.updateObserver.pipe(
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
    this.scroll$.unsubscribe();
    this.thumbDrag$.unsubscribe();
    this.updateObserver$.unsubscribe();
  }

  protected listenToScrollEvent(): void {
  }

  /**
   * Scrollbar click
   * @param e Mouse event
   */
  onScrollbarHolderClick(e: any): void {
  }

  /**
   * Update scrollbar
   */
  protected updateScrollbar(): void {
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
    return (naturalThumbSize < this.minThumbSize) ? this.minThumbSize : scrollMax ? naturalThumbSize : 0;
  }

  protected updateState(state: any): void {
    this.state.next({...this.state.value, ...state});
  }
}
