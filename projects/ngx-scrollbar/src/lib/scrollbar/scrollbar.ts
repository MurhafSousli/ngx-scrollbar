import { OnDestroy, OnInit, NgZone } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { asyncScheduler, EMPTY, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NgScrollbar } from '../ng-scrollbar';
import { ThumbAdapter } from './thumb/thumb';
import { TrackAdapter } from './track/track';
import { isWithinBounds } from './common';

export abstract class Scrollbar implements OnInit, OnDestroy {

  // Thumb directive reference
  readonly thumb: ThumbAdapter;
  // Track directive reference
  readonly track: TrackAdapter;
  // Stream that emits to unsubscribe from all streams
  protected readonly destroyed = new Subject<void>();

  /**
   * Viewport pointer events
   * The following streams are only activated when (pointerEventsMethod === 'viewport')
   */
  protected viewportTrackClicked!: Subject<any>;
  protected viewportThumbClicked!: Subject<any>;

  protected abstract get viewportScrollSize(): number;

  protected constructor(public cmp: NgScrollbar, protected platform: Platform, protected document: any, protected zone: NgZone) {
  }

  /**
   * Activate scrollbar pointer events
   */
  private activatePointerEvents(): Observable<any> {
    let thumbDragEvent: Observable<any> = EMPTY;
    let trackClickEvent: Observable<any> = EMPTY;
    let trackHoveredEvent: Observable<any> = EMPTY;

    if (this.cmp.pointerEventsMethod === 'viewport') {
      this.viewportTrackClicked = new Subject<any>();
      this.viewportThumbClicked = new Subject<any>();

      // Activate viewport pointer events
      this.cmp.viewport.activatePointerEvents(this.destroyed);

      thumbDragEvent = this.viewportThumbClicked;
      trackClickEvent = this.viewportTrackClicked;

      trackHoveredEvent = this.cmp.viewport.hovered.pipe(
        // Check if track is hovered
        map((e: any) => isWithinBounds(e, this.track.clientRect)),
        distinctUntilChanged(),
        // Enable / disable text selection
        tap((hovered: boolean) => this.document.onselectstart = hovered ? () => false : null)
      );

      this.cmp.viewport.clicked.pipe(
        tap((e: any) => {
          if (e) {
            if (isWithinBounds(e, this.thumb.clientRect)) {
              this.viewportThumbClicked.next(e);
            } else if (isWithinBounds(e, this.track.clientRect)) {
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
      thumbDragEvent = this.thumb.clicked;
      trackClickEvent = this.track.clicked;
      trackHoveredEvent = this.track.hovered;
    }

    return merge(
      // Activate scrollbar hovered event
      trackHoveredEvent.pipe(tap((e: boolean) => this.setHovered(e))),
      // Activate scrollbar thumb drag event
      thumbDragEvent.pipe(switchMap((e: any) => this.thumb.dragged(e))),
      // Activate scrollbar track click event
      trackClickEvent.pipe(switchMap((e: any) => this.track.onTrackClicked(e, this.thumb.size, this.viewportScrollSize)))
    );
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // Activate pointer events on Desktop only
      if (!(this.platform.IOS || this.platform.ANDROID) && !this.cmp.pointerEventsDisabled) {
        this.activatePointerEvents().pipe(takeUntil(this.destroyed)).subscribe();
      }

      // Update scrollbar thumb when viewport is scrolled and when scrollbar component is updated
      merge(this.cmp.scrolled, this.cmp.updated).pipe(
        tap(() => this.thumb.update()),
        takeUntil(this.destroyed)
      ).subscribe();

      // Initialize scrollbar
      asyncScheduler.schedule(() => this.thumb.update(), 100);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();

    // Clean up viewport streams if used
    if (this.cmp.pointerEventsMethod === 'viewport') {
      this.viewportTrackClicked.complete();
      this.viewportThumbClicked.complete();
    }
  }

  protected abstract setHovered(value: boolean): void;
}
