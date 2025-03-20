import {
  Directive,
  Input,
  Output,
  numberAttribute,
  booleanAttribute,
  input,
  EventEmitter,
  InputSignalWithTransform
} from '@angular/core';
import { ReachedDroppedBase } from './reached-dropped-base';

@Directive({
  selector: 'ng-scrollbar[reachedTop], ng-scrollbar[reachedBottom], ng-scrollbar[reachedStart], ng-scrollbar[reachedEnd]'
})
export class NgScrollReached extends ReachedDroppedBase {

  /** Reached offset value in px */
  @Input({ alias: 'reachedOffset', transform: numberAttribute }) set offsetSetter(value: number) {
    this.setCssVariable('--reached-offset', value);
  }

  @Input({ alias: 'reachedTopOffset', transform: numberAttribute }) set offsetTopSetter(value: number) {
    this.setCssVariable('--reached-offset-top', value);
  }

  @Input({ alias: 'reachedBottomOffset', transform: numberAttribute }) set offsetBottomSetter(value: number) {
    this.setCssVariable('--reached-offset-bottom', value);
  }

  @Input({ alias: 'reachedStartOffset', transform: numberAttribute }) set offsetStartSetter(value: number) {
    this.setCssVariable('--reached-offset-start', value);
  }

  @Input({ alias: 'reachedEndOffset', transform: numberAttribute }) set offsetEndSetter(value: number) {
    this.setCssVariable('--reached-offset-end', value);
  }

  disabled: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(false, {
    alias: 'disableReached',
    transform: booleanAttribute
  });

  @Output('reachedTop') top: EventEmitter<void> = new EventEmitter<void>();

  @Output('reachedBottom') bottom: EventEmitter<void> = new EventEmitter<void>();

  @Output('reachedStart') start: EventEmitter<void> = new EventEmitter<void>();

  @Output('reachedEnd') end: EventEmitter<void> = new EventEmitter<void>();

  protected triggerElementsWrapperClass: string = 'ng-scroll-reached-wrapper';

  protected triggerElementClass: string = 'scroll-reached-trigger-element';

  protected isTriggered(entry: IntersectionObserverEntry): boolean {
    return entry.isIntersecting;
  }
}
