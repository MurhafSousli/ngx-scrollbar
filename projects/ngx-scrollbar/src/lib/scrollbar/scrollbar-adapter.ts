import { Directive, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';

export const SCROLLBAR_CONTROL: InjectionToken<ScrollbarAdapter> = new InjectionToken<ScrollbarAdapter>('SCROLLBAR_CONTROL');

@Directive()
export abstract class ScrollbarAdapter {

  // Returns either 'clientX' or 'clientY' coordinate of the pointer relative to the viewport
  abstract readonly clientProperty: 'clientX' | 'clientY';

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
