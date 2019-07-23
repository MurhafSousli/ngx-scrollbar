import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  Inject,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Directionality } from '@angular/cdk/bidi';
import { Subject } from 'rxjs';
import { NgScrollbar } from '../ng-scrollbar';
import { ScrollbarRef } from '../classes/scrollbar-ref';
import { HorizontalScrollbarRef } from '../classes/horizontal-scrollbar-ref';
import { VerticalScrollbarRef } from '../classes/vertical-scrollbar-ref';

@Component({
  selector: 'scrollbar-control',
  host: {
    '[class.scrollbar-control]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./shared.scss', './horizontal.scss', './vertical.scss'],
  template: `
    <div #track class="ng-scrollbar-track {{parent.trackClass}}">
      <div #thumb class="ng-scrollbar-thumb {{parent.thumbClass}}"></div>
    </div>
  `
})
export class ScrollbarControl implements OnInit, OnDestroy {

  // Custom scrollbar reference
  private scrollbarRef: ScrollbarRef;

  // The axis of the scrollbar
  @Input() private track: 'horizontal' | 'vertical';

  // Scrollbar container element reference
  @ViewChild('track', { static: true }) trackRef: ElementRef;

  // Scrollbar thumb element reference
  @ViewChild('thumb', { static: true }) thumbRef: ElementRef;

  // Stream that emits to unsubscribe from all streams
  protected readonly destroyed = new Subject<void>();

  constructor(public parent: NgScrollbar,
              private platform: Platform,
              private dir: Directionality,
              private zone: NgZone,
              @Inject(DOCUMENT) private document: any) {
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // Avoid SSR Error
      if (this.platform.isBrowser) {
        this.scrollbarRef = this.track === 'vertical'
          ? new VerticalScrollbarRef(this.parent, this.document, this.trackRef, this.thumbRef, this.platform, this.destroyed)
          : new HorizontalScrollbarRef(this.parent, this.document, this.trackRef, this.thumbRef, this.platform, this.destroyed, this.dir);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
