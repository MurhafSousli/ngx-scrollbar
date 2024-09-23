import { Directive, inject, signal, WritableSignal, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';

export const SCROLLBAR_CONTROL: InjectionToken<ScrollbarAdapter> = new InjectionToken<ScrollbarAdapter>('SCROLLBAR_CONTROL');

@Directive()
export abstract class ScrollbarAdapter {

  trackSize: WritableSignal<number> = signal(0);

  abstract readonly rectOffsetProperty: 'left' | 'top';

  abstract readonly rectSizeProperty: 'width' | 'height';

  abstract readonly sizeProperty: 'offsetWidth' | 'offsetHeight';

  // Returns either 'clientX' or 'clientY' coordinate of the pointer relative to the viewport
  abstract readonly clientProperty: 'clientX' | 'clientY';

  // Returns either 'offsetX' or 'offsetY' coordinate of the pointer relative to the edge of the element
  abstract readonly offsetProperty: 'offsetX' | 'offsetY'

  // Return axis
  abstract readonly axis: 'x' | 'y';

  // Returns viewport scroll max
  abstract get viewportScrollMax(): number;

  // Returns viewport offset
  abstract get viewportScrollOffset(): number;

  // Host component reference
  readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);

  abstract scrollTo(value: number, duration: number): Observable<void>;

  abstract instantScrollTo(value: number, scrollMax?: number): void;
}
