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
import { Scrollbars } from './scrollbars/scrollbars';

@Component({
  host: {
    '[class.ng-scrollbar]': 'true'
  },
  selector: 'ng-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars, ScrollContent],
  template: `
    <ng-scroll-content>
      <ng-content/>
      <scrollbars/>
    </ng-scroll-content>
  `,
  styleUrl: 'viewport/scroll-viewport.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{
    directive: ViewportAdapter ,
    inputs: [
      'position',
      'buttons',
      'appearance',
      'thumbClass',
      'trackClass',
      'buttonClass',
      'visibility',
      'hoverOffset',
      'orientation',
      'disableSensor',
      'sensorThrottleTime',
      'disableInteraction',
      'trackScrollDuration'
    ],
    outputs: ['afterInit', 'afterUpdate']
  }]
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
