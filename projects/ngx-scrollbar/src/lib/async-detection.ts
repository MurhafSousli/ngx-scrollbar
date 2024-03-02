import { Directive, Input, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { mutationObserver } from './viewport';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport][asyncDetection]'
})
export class AsyncDetection implements OnInit, OnDestroy {

  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt);
  private readonly zone: NgZone = inject(NgZone);

  private subscription: Subscription;

  @Input() asyncDetection: 'auto' | '';

  constructor() {
    this.scrollbar.skipInit = true;
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.subscription = mutationObserver(this.scrollbar.nativeElement, 100).subscribe(() => {
        if (!this.scrollbar.viewport.initialized()) {
          // Search for external viewport
          const viewportElement: HTMLElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalViewport);

          // Search for external content wrapper
          const contentWrapperElement: HTMLElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalContentWrapper);

          if (viewportElement && contentWrapperElement) {
            // If an external spacer selector is provided, search for it
            let spacerElement: HTMLElement;
            if (this.scrollbar.externalSpacer) {
              spacerElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalSpacer);
            }

            // Initialize viewport
            this.scrollbar.viewport.init(viewportElement, contentWrapperElement, spacerElement);
            // Attach scrollbars
            this.scrollbar.attachScrollbars();

            if (!this.asyncDetection) {
              this.subscription.unsubscribe();
            }
          }
        } else {
          const viewportElement: HTMLElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalViewport);
          if (!viewportElement) {
            this.scrollbar.viewport.initialized.set(false);
            return;
          }
          const contentWrapperElement: HTMLElement = this.scrollbar.nativeElement.querySelector(this.scrollbar.externalContentWrapper);
          if (!contentWrapperElement) {
            this.scrollbar.viewport.initialized.set(false);
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
