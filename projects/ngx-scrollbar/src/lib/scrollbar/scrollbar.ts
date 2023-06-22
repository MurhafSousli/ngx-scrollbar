import { OnDestroy, OnInit, NgZone, Directive } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable, Subject, fromEvent, merge, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs';
import { NgScrollbarBase } from '../ng-scrollbar-base';
import { ThumbAdapter } from './thumb/thumb';
import { TrackAdapter } from './track/track';
import { isWithinBounds, stopPropagation } from './common';

// @dynamic
@Directive()
export abstract class Scrollbar implements OnInit, OnDestroy {

  // Thumb directive reference
  readonly thumb: ThumbAdapter | undefined;
  // Track directive reference
  readonly track: TrackAdapter | undefined;
  // Stream that emits to unsubscribe from all streams
  protected readonly destroyed = new Subject<void>();

  /**
   * Viewport pointer events
   * The following streams are only activated when (pointerEventsMethod === 'viewport')
   */
  protected viewportTrackClicked!: Subject<MouseEvent>;
  protected viewportThumbClicked!: Subject<MouseEvent>;

  protected abstract get viewportScrollSize(): number;

  protected constructor(protected el: HTMLElement,
                        public cmp: NgScrollbarBase,
                        protected platform: Platform,
                        protected document: Document,
                        protected zone: NgZone) {
  }

  /**
   * Activate scrollbar pointer events
   */
  private activatePointerEvents(): Observable<unknown> {
    // Stream that emits when scrollbar thumb is dragged
    let thumbDragEvent: Observable<MouseEvent>;
    // Stream that emits when scrollbar track is clicked
    let trackClickEvent: Observable<MouseEvent>;
    // Stream that emits when scrollbar track is hovered
    let trackHoveredEvent: Observable<boolean>;

    // Set the method used for the pointer events option
    if (this.cmp.pointerEventsMethod === 'viewport') {
      // Pointer events using the viewport
      this.viewportTrackClicked = new Subject<MouseEvent>();
      this.viewportThumbClicked = new Subject<MouseEvent>();

      // Activate the pointer events of the viewport directive
      this.cmp.viewport!.activatePointerEvents(this.cmp.viewportPropagateMouseMove, this.destroyed);

      // Set streams
      thumbDragEvent = this.viewportThumbClicked;
      trackClickEvent = this.viewportTrackClicked;
      trackHoveredEvent = this.cmp.viewport!.hovered.pipe(
        // Check if track is hovered
        map((e: MouseEvent | false) => e ? isWithinBounds(e, this.el.getBoundingClientRect()) : false),
        distinctUntilChanged(),
        // Enable / disable text selection
        tap((hovered: boolean) => this.document.onselectstart = hovered ? () => false : null)
      );

      this.cmp.viewport!.clicked.pipe(
        tap((e: MouseEvent | false) => {
          if (e) {
            if (isWithinBounds(e, this.thumb!.clientRect)) {
              this.viewportThumbClicked.next(e);
            } else if (isWithinBounds(e, this.track!.clientRect)) {
              this.cmp.setClicked(true);
              this.viewportTrackClicked.next(e);
            }
          } else {
            this.cmp.setClicked(false);
          }
        }),
        takeUntil(this.destroyed)
      ).subscribe();
    } else {
      // Pointer events method is using 'scrollbar'
      thumbDragEvent = this.thumb!.clicked;
      trackClickEvent = this.track!.clicked;
      trackHoveredEvent = this.hovered;
    }

    return merge(
      // Activate scrollbar hovered event
      trackHoveredEvent.pipe(tap((e: boolean) => this.setHovered(e))),
      // Activate scrollbar thumb drag event
      thumbDragEvent.pipe(switchMap((e: MouseEvent) => this.thumb!.dragged(e))),
      // Activate scrollbar track click event
      trackClickEvent.pipe(switchMap((e: MouseEvent) => this.track!.onTrackClicked(e, this.thumb!.size, this.viewportScrollSize)))
    );
  }

  // Stream that emits when the track element is hovered
  protected get hovered(): Observable<boolean> {
    const mouseEnter = fromEvent<MouseEvent>(this.el, 'mouseenter', { passive: true }).pipe(
      stopPropagation(),
      map(() => true)
    );
    const mouseLeave = fromEvent<MouseEvent>(this.el, 'mouseleave', { passive: true }).pipe(
      stopPropagation(),
      map(() => false)
    );
    return merge(mouseEnter, mouseLeave);
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // Activate pointer events on Desktop only
      if (!(this.platform.IOS || this.platform.ANDROID) && !this.cmp.pointerEventsDisabled) {
        this.activatePointerEvents().pipe(takeUntil(this.destroyed)).subscribe();
      }

      // Update scrollbar thumb when viewport is scrolled and when scrollbar component is updated
      merge(this.cmp.scrolled, this.cmp.updated).pipe(
        tap(() => this.thumb?.update()),
        takeUntil(this.destroyed)
      ).subscribe();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();

    // Clean up viewport streams if used
    if (this.viewportThumbClicked && this.viewportTrackClicked) {
      this.viewportTrackClicked.complete();
      this.viewportThumbClicked.complete();
    }
  }

  protected abstract setHovered(value: boolean): void;
}
