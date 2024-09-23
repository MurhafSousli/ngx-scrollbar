import { InjectionToken, Signal, WritableSignal } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { SmoothScrollToOptions } from 'ngx-scrollbar/smooth-scroll';
import { ViewportAdapter } from '../viewport';
import { ElementDimension, ScrollbarDragging } from './common';


/**
 * Injection token that can be used to query for a `NgScrollbar`.
 * Used primarily to avoid circular imports.
 */
export const NG_SCROLLBAR: InjectionToken<_NgScrollbar> = new InjectionToken<_NgScrollbar>('NG_SCROLLBAR');

export interface _NgScrollbar {
  nativeElement: HTMLElement;
  dragging: WritableSignal<ScrollbarDragging>;
  direction: Signal<Direction>;
  trackScrollDuration: Signal<number>;
  hoverOffset: Signal<boolean>;
  buttons: Signal<boolean>;
  disableSensor: Signal<boolean>;
  sensorThrottleTime: Signal<number>;
  disableInteraction: Signal<boolean>;
  isVerticallyScrollable: Signal<boolean>;
  isHorizontallyScrollable: Signal<boolean>;
  verticalUsed: Signal<boolean>;
  horizontalUsed: Signal<boolean>;
  thumbClass: Signal<string>;
  trackClass: Signal<string>;
  buttonClass: Signal<string>;
  viewportDimension: WritableSignal<ElementDimension>;
  contentDimension: WritableSignal<ElementDimension>;

  get viewport(): ViewportAdapter;

  scrollTo(options: SmoothScrollToOptions): Promise<void>;
}
