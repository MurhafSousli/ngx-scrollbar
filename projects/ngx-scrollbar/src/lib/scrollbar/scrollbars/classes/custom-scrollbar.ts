import { NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { NgScrollbar } from '../../ng-scrollbar';

export class CustomScrollbar {

  // Scrollable view element
  protected readonly viewElement: HTMLElement;

  // Streams unsubscriber
  protected readonly destroyed = new Subject();

  // Stream styles state
  protected readonly state = new BehaviorSubject<any>({transform: 'translate3d(0, 0, 0)'});

  /** Scrollbar styles */
  readonly style = this.state.asObservable();

  // Scrollbar container element
  protected containerElement: HTMLElement;

  // Scrollbar thumbnail element
  protected thumbnailElement: HTMLElement;

  get thumbnailSize(): number {
    return 0;
  }

  protected minThumbSize = 20;
  protected naturalThumbSize = 0;
  protected thumbSize = 0;
  protected trackMax = 0;
  protected scrollMax = 0;
  protected currPos = 0;

  constructor(protected scrollbarRef: NgScrollbar,
              protected document: any,
              protected zone: NgZone) {
    this.viewElement = scrollbarRef.view;
  }

  init(container: HTMLElement, thumbnail: HTMLElement) {
    this.containerElement = container;
    this.thumbnailElement = thumbnail;
    this.listenToScrollEvent();

    // Start scrollbar thumbnail drag events
    this.zone.runOutsideAngular(() => {
      this.startThumbEvents().pipe(
        takeUntil(this.destroyed)
      ).subscribe();
    });

    // Update scrollbar thumbnail size on content changes
    this.scrollbarRef.updateObserver.pipe(
      throttleTime(200),
      tap(() => this.updateScrollbar()),
      // Make sure scrollbar thumbnail position is correct after the new content is rendered
      debounceTime(200),
      tap(() => this.updateScrollbar()),
      takeUntil(this.destroyed)
    ).subscribe();

    // Initialize scrollbar
    setTimeout(() => this.updateScrollbar(), 200);
  }

  destroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected listenToScrollEvent(): void {
  }

  /**
   * Scrollbar holder click
   * @param e Mouse event
   */
  containerClick(e: any): void {
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
   */
  protected scrollBoundaries(naturalThumbSize: number, scrollMax: number): number {
    return (naturalThumbSize < this.minThumbSize) ? this.minThumbSize : scrollMax ? naturalThumbSize : 0;
  }

  protected updateState(state: any): void {
    this.state.next({...this.state.value, ...state});
  }
}
