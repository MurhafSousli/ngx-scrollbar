import {
  Directive,
  inject,
  effect,
  input,
  numberAttribute,
  NgZone,
  EffectCleanupRegisterFn,
  InputSignalWithTransform
} from '@angular/core';
import { Subscription, animationFrameScheduler, fromEvent, tap, debounceTime, throttleTime } from 'rxjs';
import { ViewportAdapter, NgScrollbarOptions, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

@Directive({
  selector: 'ng-scrollbar[visibleOnScroll]'
})
export class NgScrollHoverVisibility {

  /** Global options */
  private readonly options: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS);

  private zone: NgZone = inject(NgZone);

  private viewport: ViewportAdapter = inject(ViewportAdapter);

  /** Time in ms to wait after scrolling stops before hiding the scrollbar */
  scrollHideDelay: InputSignalWithTransform<number, number | string> = input<number, number | string>(this.options.scrollHideDelay, {
    transform: numberAttribute
  });

  /** Throttle time to prevent excessive updates during active scrolling */
  scrollThrottleTime: InputSignalWithTransform<number, number | string> = input<number, number | string>(this.options.scrollThrottleTime, {
    transform: numberAttribute
  });

  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {

      let sub$: Subscription;

      // Only activate this logic if the scrollbar is configured to show on hover
      if (this.viewport.initialized() && this.viewport.visibility() === 'hover') {
        const el: HTMLElement = this.viewport.viewportElement;

        this.zone.runOutsideAngular(() => {
          sub$ = fromEvent(el, 'scroll', { passive: true }).pipe(
            throttleTime(this.scrollThrottleTime(), animationFrameScheduler, {
              leading: true,
              trailing: false
            }),
            tap(() => {
              if (el.getAttribute('scrolling') !== 'true') {
                el.setAttribute('scrolling', 'true');
              }
            }),
            debounceTime(this.scrollHideDelay()),
            tap(() => {
              if (el.getAttribute('scrolling') !== 'false') {
                el.setAttribute('scrolling', 'false');
              }
            })
          ).subscribe();
        });
      }

      onCleanup(() => sub$?.unsubscribe());
    });
  }

}
