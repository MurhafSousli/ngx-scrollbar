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
  selector: 'ng-scrollbar[droppedTop], ng-scrollbar[droppedBottom], ng-scrollbar[droppedStart], ng-scrollbar[droppedEnd]',
  standalone: true,
})
export class NgScrollDropped extends ReachedDroppedBase {

  /** Dropped offset value in px */
  @Input({ alias: 'droppedOffset', transform: numberAttribute }) set offsetSetter(value: number) {
    this.setCssVariable('--dropped-offset', value);
  }

  @Input({ alias: 'droppedTopOffset', transform: numberAttribute }) set offsetTopSetter(value: number) {
    this.setCssVariable('--dropped-offset-top', value);
  }

  @Input({ alias: 'droppedBottomOffset', transform: numberAttribute }) set offsetBottomSetter(value: number) {
    this.setCssVariable('--dropped-offset-bottom', value);
  }

  @Input({ alias: 'droppedStartOffset', transform: numberAttribute }) set offsetStartSetter(value: number) {
    this.setCssVariable('--dropped-offset-start', value);
  }

  @Input({ alias: 'droppedEndOffset', transform: numberAttribute }) set offsetEndSetter(value: number) {
    this.setCssVariable('--dropped-offset-end', value);
  }

  disabled: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(false, {
    alias: 'disableDropped',
    transform: booleanAttribute
  });

  @Output('droppedTop') top: EventEmitter<void> = new EventEmitter<void>();

  @Output('droppedBottom') bottom: EventEmitter<void> = new EventEmitter<void>();

  @Output('droppedStart') start: EventEmitter<void> = new EventEmitter<void>();

  @Output('droppedEnd') end: EventEmitter<void> = new EventEmitter<void>();

  protected triggerElementsWrapperClass: string = 'ng-scroll-dropped-wrapper';

  protected triggerElementClass: string = 'scroll-dropped-trigger-element';

  protected isTriggered(entry: IntersectionObserverEntry): boolean {
    return !entry.isIntersecting;
  }
}
