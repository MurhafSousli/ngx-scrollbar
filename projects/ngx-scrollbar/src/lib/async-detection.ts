import { Directive, Input, inject, effect, untracked, NgZone, EffectCleanupRegisterFn } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { mutationObserver } from './viewport';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport][asyncDetection]'
})
export class AsyncDetection {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });
  private readonly zone: NgZone = inject(NgZone);

  @Input() asyncDetection: 'auto' | '';

  constructor() {
    this.scrollbar.skipInit = true;
    let sub$: Subscription;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const init: boolean = this.scrollbar.viewport.initialized();
      const externalViewport: string = this.scrollbar.externalViewport();
      const externalContentWrapper: string = this.scrollbar.externalContentWrapper();
      const externalSpacer: string = this.scrollbar.externalSpacer();

      untracked(() => {
        let viewportElement: HTMLElement;
        let contentWrapperElement: HTMLElement;

        this.zone.runOutsideAngular(() => {
          sub$ = mutationObserver(this.scrollbar.nativeElement, 100).subscribe(() => {
            // Search for external viewport
            viewportElement = this.scrollbar.nativeElement.querySelector(externalViewport);

            // Search for external content wrapper
            contentWrapperElement = this.scrollbar.nativeElement.querySelector(externalContentWrapper);

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

            if (!this.asyncDetection) {
              sub$.unsubscribe();
            }
          });
        });

        onCleanup(() => sub$?.unsubscribe());
      });
    });
  }
}
