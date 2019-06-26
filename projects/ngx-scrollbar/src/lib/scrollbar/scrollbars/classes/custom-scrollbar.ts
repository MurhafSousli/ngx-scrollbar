import { NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { NgScrollbar } from '../../ng-scrollbar';

export abstract class CustomScrollbar {

  // Scrollable view element
  protected readonly viewElement: HTMLElement;

  // Stream that emits to unsubscribe from all streams
  protected readonly destroyed = new Subject();

  // Stream styles state
  protected readonly state = new BehaviorSubject<any>({transform: 'translate3d(0, 0, 0)'});

  /** Scrollbar styles */
  readonly style = this.state.asObservable();

  /** Scrollbar thumbnail size */
  thumbnailSize: number = 0;

  /**
   * Variables used to calculate thumbnail position
   */
  protected minThumbSize: number = 20;
  protected naturalThumbSize: number = 0;
  protected thumbSize: number = 0;
  protected trackMax: number = 0;
  protected scrollMax: number = 0;
  protected currPos: number = 0;

  protected constructor(protected scrollbarRef: NgScrollbar,
                        protected document: any,
                        protected zone: NgZone,
                        protected containerElement: HTMLElement,
                        protected thumbnailElement: HTMLElement) {
    this.viewElement = scrollbarRef.view;

    this.listenToScrollEvent().pipe(
      tap(() => this.updateScrollbarThumbnailPosition()),
      takeUntil(this.destroyed)
    ).subscribe();

    // Start scrollbar thumbnail drag events
    this.zone.runOutsideAngular(() => {
      this.startThumbEvents().pipe(
        takeUntil(this.destroyed)
      ).subscribe();
    });

    // Update scrollbar thumbnail position and size
    this.scrollbarRef.updateObserver.pipe(
      throttleTime(200),
      tap(() => {
        this.updateScrollbarThumbnailSize();
        this.updateScrollbarThumbnailPosition();
      }),
      takeUntil(this.destroyed)
    ).subscribe();

    if (!this.scrollbarRef.resizeSensor) {
      // Initialize scrollbar
      setTimeout(() => {
        this.updateScrollbarThumbnailSize();
        this.updateScrollbarThumbnailPosition();
      }, 200);
    }
  }

  destroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /**
   * Get scrollbar thumb size
   */
  protected scrollBoundaries(naturalThumbSize: number, scrollMax: number): number {
    return (naturalThumbSize < this.minThumbSize) ? this.minThumbSize : scrollMax ? naturalThumbSize : 0;
  }

  protected updateState(state: any): void {
    this.state.next({...this.state.value, ...state});
  }

  abstract containerClick(e: any): void;

  protected abstract startThumbEvents(): Observable<any>;

  protected abstract listenToScrollEvent(): Observable<any>;

  protected abstract updateScrollbarThumbnailSize(): void;

  protected abstract updateScrollbarThumbnailPosition(): void;
}
