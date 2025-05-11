import { Directive, effect, inject, untracked, ElementRef, NgZone, EffectCleanupRegisterFn } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { SCROLLBAR_CONTROL, ScrollbarAdapter } from '../scrollbar/scrollbar-adapter';
import { ViewportAdapter } from '../viewport/viewport-adapter';

@Directive()
export abstract class PointerEventsAdapter {

  // Reference to the ScrollViewport component
  protected readonly host: ViewportAdapter = inject(ViewportAdapter);

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

  protected constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      const disableInteraction: boolean = this.host.disableInteraction();

      untracked(() => {
        if (!disableInteraction) {
          this.zone.runOutsideAngular(() => {
            this._pointerEventsSub = this.pointerEvents.subscribe();
          });
        }

        onCleanup(() => this._pointerEventsSub?.unsubscribe());
      });
    });
  }
}
