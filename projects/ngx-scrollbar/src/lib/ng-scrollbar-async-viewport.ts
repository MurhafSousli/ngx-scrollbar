import {
  Directive,
  inject,
  effect,
  input,
  InputSignal,
  EffectCleanupRegisterFn
} from '@angular/core';
import { ContentObserver } from '@angular/cdk/observers';
import { Subscription, throttleTime } from 'rxjs';
import { NgScrollbarExt } from './ng-scrollbar-ext';

type AsyncViewportOption = '' | 'auto';

@Directive({
  selector: 'ng-scrollbar[externalViewport][asyncViewport]'
})
export class NgScrollbarAsyncViewport {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  private readonly contentObserver: ContentObserver = inject(ContentObserver);

  asyncViewport: InputSignal<AsyncViewportOption> = input.required<AsyncViewportOption>();

  constructor() {
    this.scrollbar.skipInit = true;
    let sub$: Subscription;
    let init: boolean;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const externalViewport: string = this.scrollbar.externalViewport();
      const externalContentWrapper: string = this.scrollbar.externalContentWrapper();
      const externalSpacer: string = this.scrollbar.externalSpacer();
      const asyncDetection: AsyncViewportOption = this.asyncViewport();

      // The content observer should not be throttled using the same function we use for ResizeObserver,
      // It should detect the content change asap to attach the scrollbar
      sub$ = this.contentObserver.observe(this.scrollbar.nativeElement).pipe(
        throttleTime(100, null, {
          leading: true,
          trailing: true
        })
      ).subscribe(() => {
        // Search for the viewport element
        this.scrollbar.viewportElement.set(this.scrollbar.getElement(externalViewport))
        // Search for the content wrapper element
        this.scrollbar.contentWrapperElement.set(this.scrollbar.getElement(externalContentWrapper));
        // Search for the spacer element
        this.scrollbar.spacerElement.set(this.scrollbar.getElement(externalSpacer));

        const contentWrapperCheck: boolean = externalContentWrapper ? !!this.scrollbar.contentWrapperElement() : true;
        const spacerPassCheck: boolean = externalSpacer ? !!this.scrollbar.spacerElement() : true;

        if (!init && this.scrollbar.viewportElement() && contentWrapperCheck && spacerPassCheck) {
          // If an external spacer selector is provided, search for it
          this.scrollbar.initialize(
            this.scrollbar.viewportElement(),
            this.scrollbar.contentWrapperElement(),
            this.scrollbar.spacerElement()
          );
          init = true;
        } else if (!this.scrollbar.viewportElement() ||
          (externalContentWrapper && !this.scrollbar.contentWrapperElement()) ||
          (externalSpacer && !this.scrollbar.spacerElement())) {
          this.scrollbar.destroy();
          init = false;
        }

        if (asyncDetection !== 'auto') {
          sub$.unsubscribe();
        }
      });

      onCleanup(() => sub$?.unsubscribe());
    });
  }
}
