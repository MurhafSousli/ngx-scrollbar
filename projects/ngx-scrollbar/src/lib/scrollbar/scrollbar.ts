import { Component, OnDestroy, ViewChild, Inject, ChangeDetectionStrategy, OnInit, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { asyncScheduler, EMPTY, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NgScrollbar } from '../ng-scrollbar';
import { TrackXDirective, TrackYDirective } from './track/track.directive';
import { ThumbXDirective, ThumbYDirective } from './thumb/thumb.directive';
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
      this.cmp.viewport.activatePointerEvents();

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
          if (isWithinBounds(e, this.thumb.clientRect)) {
            this.viewportThumbClicked.next(e);
          } else if (isWithinBounds(e, this.track.clientRect)) {
            this.viewportTrackClicked.next(e);
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

@Component({
  selector: 'scrollbar-y',
  host: { '[class.scrollbar-control]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./vertical.scss'],
  template: `
    <div scrollbarTrackY class="ng-scrollbar-track {{cmp.trackClass}}">
      <div scrollbarThumbY [track]="track" class="ng-scrollbar-thumb {{cmp.thumbClass}}"></div>
    </div>
  `
})
export class ScrollbarY extends Scrollbar {

  @ViewChild(TrackYDirective, { static: true }) readonly track: TrackYDirective;
  @ViewChild(ThumbYDirective, { static: true }) readonly thumb: ThumbYDirective;

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.scrollHeight;
  }

  constructor(public cmp: NgScrollbar, protected platform: Platform, @Inject(DOCUMENT) protected document: any, protected zone: NgZone) {
    super(cmp, platform, document, zone);
  }

  protected setHovered(value: boolean): void {
    this.cmp.setHovered({ verticalHovered: value });
  }
}

@Component({
  selector: 'scrollbar-x',
  host: { '[class.scrollbar-control]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./horizontal.scss'],
  template: `
    <div scrollbarTrackX class="ng-scrollbar-track {{cmp.trackClass}}">
      <div scrollbarThumbX [track]="track" class="ng-scrollbar-thumb {{cmp.thumbClass}}"></div>
    </div>
  `
})
export class ScrollbarX extends Scrollbar {

  @ViewChild(TrackXDirective, { static: true }) readonly track: TrackXDirective;
  @ViewChild(ThumbXDirective, { static: true }) readonly thumb: ThumbXDirective;

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.scrollWidth;
  }

  constructor(public cmp: NgScrollbar, protected platform: Platform, @Inject(DOCUMENT) protected document: any, protected zone: NgZone) {
    super(cmp, platform, document, zone);
  }

  protected setHovered(value: boolean): void {
    this.cmp.setHovered({ horizontalHovered: value });
  }
}
