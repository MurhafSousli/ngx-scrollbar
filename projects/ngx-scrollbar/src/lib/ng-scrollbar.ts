import { Component, effect, untracked, viewChild, Signal, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ViewportAdapter } from './viewport';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';
import { ScrollbarContent } from './viewport/scrollbar-content';

@Component({
  selector: 'ng-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars, ScrollbarContent],
  template: `
    <scroll-content #contentWrapper>
      <ng-content/>
      <scrollbars/>
    </scroll-content>
  `,
  styleUrl: './ng-scrollbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbar },
    ViewportAdapter
  ]
})
export class NgScrollbar extends NgScrollbarCore {

  contentWrapper: Signal<ElementRef<HTMLElement>> = viewChild.required('contentWrapper', { read: ElementRef });

  _scrollbars: Signal<Scrollbars> = viewChild.required(Scrollbars);

  constructor() {
    effect(() => {
      const contentWrapper: HTMLElement = this.contentWrapper().nativeElement;
      untracked(() => {
        this.viewport.init(this.nativeElement, contentWrapper);
      });
    });
    super();
  }
}
