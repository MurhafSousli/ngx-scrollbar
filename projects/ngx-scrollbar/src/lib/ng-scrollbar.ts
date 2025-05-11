import {
  Component,
  effect,
  computed,
  untracked,
  viewChild,
  Signal,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ViewportAdapter, ScrollContent } from './viewport';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

@Component({
  host: {
    '[class.ng-scrollbar]': 'true',
    // '[attr.verticalUsed]': 'verticalUsed()',
    // '[attr.horizontalUsed]': 'horizontalUsed()',
    // '[attr.isVerticallyScrollable]': 'isVerticallyScrollable()',
    // '[attr.isHorizontallyScrollable]': 'isHorizontallyScrollable()',
    // '[attr.mobile]': 'isMobile',
    // '[attr.dir]': 'direction()',
    // '[attr.position]': 'position()',
    // '[attr.dragging]': 'dragging()',
    // '[attr.appearance]': 'appearance()',
    // '[attr.visibility]': 'visibility()',
    // '[attr.orientation]': 'orientation()',
    // '[attr.disableInteraction]': 'disableInteraction()',
    // '[style.--content-height]': 'contentDimension().height',
    // '[style.--content-width]': 'contentDimension().width',
    // '[style.--viewport-height]': 'viewportDimension().height',
    // '[style.--viewport-width]': 'viewportDimension().width'
  },
  selector: 'ng-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars, ScrollContent],
  template: `
    <ng-scroll-content>
      <ng-content/>
    </ng-scroll-content>
    <scrollbars/>
  `,
  styleUrl: 'viewport/scroll-viewport.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbar },
    ViewportAdapter
  ]
})
export class NgScrollbar extends NgScrollbarCore {

  private contentWrapper: Signal<ElementRef<HTMLElement>> = viewChild.required(ScrollContent, { read: ElementRef });

  contentWrapperElement: Signal<HTMLElement> = computed(() => this.contentWrapper().nativeElement);

  constructor() {
    effect(() => {
      const contentWrapper: HTMLElement = this.contentWrapperElement();
      untracked(() => {
        this.viewport.init(this.nativeElement, contentWrapper);
      });
    });
    super();
  }
}
