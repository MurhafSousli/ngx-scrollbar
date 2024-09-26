import {
  Directive,
  inject,
  effect,
  untracked,
  input,
  NgZone,
  InputSignal,
  EffectCleanupRegisterFn
} from '@angular/core';
import { ContentObserver } from '@angular/cdk/observers';
import { Subscription, throttleTime } from 'rxjs';
import { NgScrollbarExt } from './ng-scrollbar-ext';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport][asyncDetection]'
})
export class AsyncDetection {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });
  private readonly zone: NgZone = inject(NgZone);

  private readonly contentObserver: ContentObserver = inject(ContentObserver);

  asyncDetection: InputSignal<'auto' | ''> = input();

  constructor() {
    this.scrollbar.skipInit = true;
    let sub$: Subscription;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const init: boolean = this.scrollbar.viewport.initialized();
      const externalViewport: string = this.scrollbar.externalViewport();
      const externalContentWrapper: string = this.scrollbar.externalContentWrapper();
      const externalSpacer: string = this.scrollbar.externalSpacer();
      const asyncDetection: 'auto' | '' = this.asyncDetection();

      untracked(() => {
        let viewportElement: HTMLElement;
        let contentWrapperElement: HTMLElement;

        this.zone.runOutsideAngular(() => {
          // The content observer should not be throttled using the same function we use for ResizeObserver,
          // It should detect the content change asap to attach the scrollbar
          sub$ = this.contentObserver.observe(this.scrollbar.nativeElement).pipe(
            throttleTime(100, null, {
              leading: true,
              trailing: true
            })
          ).subscribe(() => {
            // Search for external viewport
            viewportElement = this.scrollbar.nativeElement.querySelector(externalViewport);

            // Search for external content wrapper
            contentWrapperElement = this.scrollbar.nativeElement.querySelector(externalContentWrapper);

            this.zone.run(() => {
              if (!init && viewportElement && contentWrapperElement) {
                // If an external spacer selector is provided, search for it
                let spacerElement: HTMLElement;
                if (externalSpacer) {
                  spacerElement = this.scrollbar.nativeElement.querySelector(externalSpacer);
                }

                this.scrollbar.skipInit = false;
                this.scrollbar.altViewport.set(viewportElement);
                this.scrollbar.altContentWrapper.set(contentWrapperElement);
                this.scrollbar.altSpacer.set(spacerElement);
              } else if (!viewportElement || !contentWrapperElement) {
                this.scrollbar.viewport.reset();
              }
            });

            if (asyncDetection !== 'auto') {
              sub$.unsubscribe();
            }
          });
        });

        onCleanup(() => sub$?.unsubscribe());
      });
    });
  }
}
