import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Input, NgZone, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TrackXDirective, TrackYDirective } from './track/track.directive';
import { ThumbXDirective, ThumbYDirective } from './thumb/thumb.directive';
import { NgScrollbar } from '../ng-scrollbar';
import { Scrollbar } from './scrollbar';

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
export class ScrollbarY extends Scrollbar implements AfterViewInit {

  @ViewChild(TrackYDirective, { static: true }) readonly track: TrackYDirective;
  @ViewChild(ThumbYDirective, { static: true }) readonly thumb: ThumbYDirective;

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.scrollHeight;
  }

  /**
   * Auto-height feature
   * This input is meant to trigger change detection
   */
  @Input() set autoHeight(e: void) {
  }

  constructor(public cmp: NgScrollbar, protected platform: Platform, @Inject(DOCUMENT) protected document: any, protected zone: NgZone) {
    super(cmp, platform, document, zone);
  }

  ngAfterViewInit() {
    // Auto-height: Set root component height to content height
    this.cmp.nativeElement.style.height = this.cmp.appearance === 'standard'
      ? `${this.cmp.viewport.contentHeight + this.track.thickness}px`
      : `${this.cmp.viewport.contentHeight}px`;
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
