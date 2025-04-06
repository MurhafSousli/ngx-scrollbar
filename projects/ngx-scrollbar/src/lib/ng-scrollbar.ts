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
import { ViewportAdapter, ScrollbarContent } from './viewport';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

@Component({
  selector: 'ng-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars, ScrollbarContent],
  template: `
    <ng-scroll-content>
      <ng-content/>
      <scrollbars/>
    </ng-scroll-content>
  `,
  styleUrl: './ng-scrollbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbar },
    ViewportAdapter
  ]
})
export class NgScrollbar extends NgScrollbarCore {

  private contentWrapper: Signal<ElementRef<HTMLElement>> = viewChild.required(ScrollbarContent, { read: ElementRef });

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
