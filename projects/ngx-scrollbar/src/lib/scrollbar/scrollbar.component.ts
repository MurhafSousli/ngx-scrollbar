import { Component, Inject, NgZone, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TrackXDirective, TrackYDirective } from './track/track.directive';
import { ThumbXDirective, ThumbYDirective } from './thumb/thumb.directive';
import { NgScrollbarBase } from '../ng-scrollbar-base';
import { Scrollbar } from './scrollbar';

@Component({
  selector: 'scrollbar-y',
  host: { '[class.scrollbar-control]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./vertical.scss'],
  template: `
    <div scrollbarTrackY class="ng-scrollbar-track {{cmp.trackClass}}">
      <div scrollbarThumbY class="ng-scrollbar-thumb {{cmp.thumbClass}}"></div>
    </div>
  `,
  standalone: true,
  imports: [TrackYDirective, ThumbYDirective]
})
export class ScrollbarY extends Scrollbar {

  @ViewChild(TrackYDirective, { static: true }) readonly track: TrackYDirective | undefined;
  @ViewChild(ThumbYDirective, { static: true }) readonly thumb: ThumbYDirective | undefined;

  protected get viewportScrollSize(): number {
    return this.cmp.viewport!.scrollHeight;
  }

  constructor(el: ElementRef,
              public cmp: NgScrollbarBase,
              protected platform: Platform,
              @Inject(DOCUMENT) protected document: Document,
              protected zone: NgZone) {
    super(el.nativeElement, cmp, platform, document, zone);
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
      <div scrollbarThumbX class="ng-scrollbar-thumb {{cmp.thumbClass}}"></div>
    </div>
  `,
  standalone: true,
  imports: [TrackXDirective, ThumbXDirective]
})
export class ScrollbarX extends Scrollbar {

  @ViewChild(TrackXDirective, { static: true }) readonly track: TrackXDirective | undefined;
  @ViewChild(ThumbXDirective, { static: true }) readonly thumb: ThumbXDirective | undefined;

  protected get viewportScrollSize(): number {
    return this.cmp.viewport!.scrollWidth;
  }

  constructor(el: ElementRef,
              public cmp: NgScrollbarBase,
              protected platform: Platform,
              @Inject(DOCUMENT) protected document: Document,
              protected zone: NgZone) {
    super(el.nativeElement, cmp, platform, document, zone);
  }

  protected setHovered(value: boolean): void {
    this.cmp.setHovered({ horizontalHovered: value });
  }
}
