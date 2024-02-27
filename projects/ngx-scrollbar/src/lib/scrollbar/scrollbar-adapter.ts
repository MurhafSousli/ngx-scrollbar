import {
  Directive,
  ViewChild,
  effect,
  inject,
  NgZone,
  ElementRef,
  EffectCleanupRegisterFn
} from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { ThumbAdapter } from '../thumb/thumb-adapter';
import { TrackAdapter } from '../track/track-adapter';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';

// @dynamic
@Directive()
export abstract class ScrollbarAdapter {

  // Thumb directive reference
  readonly thumb: ThumbAdapter;
  // Track directive reference
  readonly track: TrackAdapter;
  // Pointer events subscription
  private pointerEventsSub: Subscription;
  // Zone reference
  protected readonly zone: NgZone = inject(NgZone);
  // Host component reference
  readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);

  // Sticky wrapper reference for testing purpose
  @ViewChild('sticky', { static: true }) readonly sticky: ElementRef<HTMLElement>;

  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      if (this.cmp.disableInteraction()) {
        this.pointerEventsSub?.unsubscribe();
      } else {
        this.zone.runOutsideAngular(() => {
          this.pointerEventsSub = merge(
            // Activate scrollbar thumb drag event
            this.thumb.dragged,
            // Activate scrollbar track click event
            this.track.dragged
          ).subscribe();
        });
      }

      onCleanup(() => this.pointerEventsSub?.unsubscribe());
    });
  }
}
