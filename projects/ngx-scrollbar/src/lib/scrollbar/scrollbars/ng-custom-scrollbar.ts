import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  Inject,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  forwardRef,
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
         class="ng-scrollbar-rail {{parent.railClass}}">
         (mousedown)="customScrollbar.containerClick($event)">
      <div #thumbnail
           class="ng-scrollbar-thumbnail {{parent.thumbClass}}"
           [ngStyle]="customScrollbar.style | async">
      </div>
    </div>
  `
})
export class NgCustomScrollbar implements OnInit, OnDestroy {

  // Custom scrollbar reference
  customScrollbar: CustomScrollbar;

  // Custom scrollbar type
  @Input() axis: 'horizontal' | 'vertical';

  // Scrollbar container element reference
  @ViewChild('container', {static: true}) containerRef: ElementRef;

  // Scrollbar thumbnail element reference
  @ViewChild('thumbnail', {static: true}) thumbnailRef: ElementRef;

  constructor(@Inject(forwardRef(() => NgScrollbar)) public parent: NgScrollbar,
              @Inject(PLATFORM_ID) private platform: object,
              @Inject(DOCUMENT) private document: any,
              private zone: NgZone) {
  }

  ngOnInit() {
    // Avoid SSR Error
    if (isPlatformBrowser(this.platform)) {
      this.customScrollbar = this.axis === 'vertical'
        ? new VerticalScrollbar(this.parent, this.document, this.zone, this.containerRef.nativeElement, this.thumbnailRef.nativeElement)
        : new HorizontalScrollbar(this.parent, this.document, this.zone, this.containerRef.nativeElement, this.thumbnailRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.customScrollbar.destroy();
  }
}
