import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  Input,
  Inject,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy, PLATFORM_ID, OnInit
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
export class NgCustomScrollbar implements OnInit, AfterViewInit, OnDestroy {

  // Custom scrollbar reference
  customScrollbar: CustomScrollbar;

  // Custom scrollbar type
  @Input() type: 'horizontal' | 'vertical';

  // Scrollbar container element reference
  @ViewChild('container') containerRef: ElementRef;

  // Scrollbar thumbnail element reference
  @ViewChild('thumbnail') thumbnailRef: ElementRef;

  constructor(public parent: NgScrollbar,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platform: Object,
              @Inject(DOCUMENT) private document: any) {
  }

  ngOnInit() {
    if (this.type === 'vertical') {
      this.customScrollbar = new VerticalScrollbar(this.parent, this.document, this.zone);
    } else {
      this.customScrollbar = new HorizontalScrollbar(this.parent, this.document, this.zone);
    }
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
