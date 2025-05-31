import {
  Directive,
  output,
  inject,
  numberAttribute,
  booleanAttribute,
  input,
  InputSignal,
  OutputEmitterRef,
  InputSignalWithTransform
} from '@angular/core';
import {
  NG_SCROLLBAR_OPTIONS,
  NgScrollbarOptions,
  ScrollbarAppearance,
  ScrollbarOrientation,
  ScrollbarPosition,
  ScrollbarVisibility
} from '../ng-scrollbar.model';

@Directive()
export class ScrollbarInputOutputs {

  /** Global options */
  private readonly options: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS);

  /**
   * Sets the supported scroll track of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar
   * - `horizontal` Use both vertical and horizontal scrollbar
   * - `auto` Use both vertical and horizontal scrollbar
   */
  orientation: InputSignal<ScrollbarOrientation> = input<ScrollbarOrientation>(this.options.orientation);

  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable
   */
  visibility: InputSignal<ScrollbarVisibility> = input<ScrollbarVisibility>(this.options.visibility);

  /** Show scrollbar buttons */
  buttons: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.buttons, {
    transform: booleanAttribute
  });

  /** Disables scrollbar interaction like dragging thumb and jumping by track click */
  disableInteraction: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableInteraction, {
    transform: booleanAttribute
  });

  /** Whether ResizeObserver is disabled */
  disableSensor: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableSensor, {
    transform: booleanAttribute
  });

  /** Throttle interval for detecting changes via ResizeObserver */
  sensorThrottleTime: InputSignalWithTransform<number, string | number> = input<number, string | number>(this.options.sensorThrottleTime, {
    transform: numberAttribute
  });

  /** A flag used to activate hover effect on the offset area around the scrollbar */
  hoverOffset: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.hoverOffset, {
    transform: booleanAttribute
  });

  /** Scroll duration when the scroll track is clicked */
  trackScrollDuration: InputSignalWithTransform<number, string | number> = input<number, string | number>(this.options.trackScrollDuration, {
    transform: numberAttribute
  });

  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `native` (default) scrollbar space will be reserved just like with native scrollbar.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.
   */
  appearance: InputSignal<ScrollbarAppearance> = input<ScrollbarAppearance>(this.options.appearance);
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar positions
   */
  position: InputSignal<ScrollbarPosition> = input<ScrollbarPosition>(this.options.position);

  /** A class forwarded to the scrollbar track element */
  trackClass: InputSignal<string> = input<string>(this.options.trackClass);
  /** A class forwarded to the scrollbar thumb element */
  thumbClass: InputSignal<string> = input<string>(this.options.thumbClass);
  /** A class forwarded to the scrollbar button element */
  buttonClass: InputSignal<string> = input<string>(this.options.thumbClass);

  /** Steam that emits when scrollbar is initialized */
  afterInit: OutputEmitterRef<void> = output<void>();

  /** Steam that emits when scrollbar is updated */
  afterUpdate: OutputEmitterRef<void> = output<void>();
}
