import { Directive, effect, inject, ElementRef, NgZone, EffectCleanupRegisterFn, untracked } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { _NgScrollbar, NG_SCROLLBAR } from '../utils/scrollbar-base';
import { SCROLLBAR_CONTROL, ScrollbarAdapter } from '../scrollbar/scrollbar-adapter';

@Directive()
export abstract class PointerEventsAdapter {

  // Reference to the NgScrollbar component
  protected readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);

  // Reference to the Scrollbar control component
  protected readonly control: ScrollbarAdapter = inject(SCROLLBAR_CONTROL);

  // Reference to the Document element
  protected readonly document: Document = inject(DOCUMENT);

  // Reference to angular zone
  protected readonly zone: NgZone = inject(NgZone);

  // The native element of the directive
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  // Pointer events subscription (made public for testing purpose)
  _pointerEventsSub: Subscription;

  abstract get pointerEvents(): Observable<PointerEvent>;

  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      const disableInteraction: boolean = this.cmp.disableInteraction();

      untracked(() => {
        if (disableInteraction) {
          this._pointerEventsSub?.unsubscribe();
        } else {
          this.zone.runOutsideAngular(() => {
            this._pointerEventsSub = this.pointerEvents.subscribe();
          });
        }
      });

      onCleanup(() => this._pointerEventsSub?.unsubscribe());
    });
  }
}
