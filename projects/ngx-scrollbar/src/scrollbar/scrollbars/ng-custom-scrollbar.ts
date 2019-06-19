import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  Input,
  Inject,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NgScrollbar } from '../ng-scrollbar';
import { CustomScrollbar } from './classes/custom-scrollbar';
import { HorizontalScrollbar } from './classes/horizontal-scrollbar';
import { VerticalScrollbar } from './classes/vertical-scrollbar';

@Component({
  selector: 'ng-custom-scrollbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './ng-scrollbar-shared.scss',
    './ng-horizontal-scrollbar.scss',
    './ng-vertical-scrollbar.scss'
  ],
  template: `
    <div #container
         class="ng-scrollbar-container {{parent.barClass}}"
         (mousedown)="customScrollbar.containerClick($event)">
      <div #thumbnail
           class="ng-scrollbar-thumbnail {{parent.thumbClass}}"
           [ngStyle]="customScrollbar.style | async">
      </div>
    </div>
  `
})
export class NgCustomScrollbar implements AfterViewInit, OnDestroy {

  // Custom scrollbar reference
  customScrollbar: CustomScrollbar;

  // Custom scrollbar type
  @Input() set axis(axis: 'horizontal' | 'vertical') {
    const customScrollbar = {
      vertical: (parent, document, zone) => new VerticalScrollbar(parent, document, zone),
      horizontal: (parent, document, zone) => new HorizontalScrollbar(parent, document, zone)
    };
    this.customScrollbar = customScrollbar[axis](this.parent, this.document, this.zone);
  }

  // Scrollbar container element reference
  @ViewChild('container') containerRef: ElementRef;

  // Scrollbar thumbnail element reference
  @ViewChild('thumbnail') thumbnailRef: ElementRef;

  constructor(public parent: NgScrollbar,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platform: Object,
              @Inject(DOCUMENT) private document: any) {
  }

  ngAfterViewInit() {
    // Avoid SSR Error
    if (isPlatformBrowser(this.platform)) {
      this.customScrollbar.init(this.containerRef.nativeElement, this.thumbnailRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.customScrollbar.destroy();
  }
}
