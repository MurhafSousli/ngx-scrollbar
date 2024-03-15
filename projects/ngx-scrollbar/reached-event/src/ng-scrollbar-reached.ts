import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  Input,
  Output,
  OnInit,
  OnDestroy,
  NgZone,
  Renderer2,
  WritableSignal,
  Injector,
  inject,
  signal,
  effect,
  numberAttribute,
  booleanAttribute,
  runInInjectionContext,
  EventEmitter,
  PLATFORM_ID
} from '@angular/core';
import { _NgScrollbar, NG_SCROLLBAR } from 'ngx-scrollbar';

type ReachedEventAction = {
  emit: () => void;
}

@Directive({
  selector: 'ng-scrollbar[reachedTop], ng-scrollbar[reachedBottom], ng-scrollbar[reachedStart], ng-scrollbar[reachedEnd]',
  standalone: true,
})
export class NgScrollbarReached implements OnInit, OnDestroy {

  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly zone: NgZone = inject(NgZone);

  private readonly renderer: Renderer2 = inject(Renderer2);

  private readonly injector: Injector = inject(Injector);

  private readonly scrollbar: _NgScrollbar = inject(NG_SCROLLBAR);

  private readonly disabled: WritableSignal<boolean> = signal(false);

  /** An array that contains all trigger elements  **/
  private triggerElements: HTMLElement[] = [];

  /** The intersection observer reference */
  private intersectionObserver: IntersectionObserver;

  /** An array that contains the chosen outputs */
  private subscribedEvents: string[] = [];

  /** The scrollbars element that contains the trigger elements */
  private triggerElementsWrapper: HTMLElement;

  /** Reached offset value in px */
  @Input({ alias: 'reachedOffset', transform: numberAttribute }) set offsetSetter(value: number) {
    this.setCssVariable('--reached-offset', value);
  }

  @Input({ alias: 'reachedTopOffset', transform: numberAttribute }) set offsetTopSetter(value: number) {
    this.setCssVariable('--reached-offset-top', value);
  }

  @Input({ alias: 'reachedBottomOffset', transform: numberAttribute }) set offsetBottomSetter(value: number) {
    this.setCssVariable('--reached-offset-bottom', value);
  }

  @Input({ alias: 'reachedStartOffset', transform: numberAttribute }) set offsetStartSetter(value: number) {
    this.setCssVariable('--reached-offset-start', value);
  }

  @Input({ alias: 'reachedEndOffset', transform: numberAttribute }) set offsetEndSetter(value: number) {
    this.setCssVariable('--reached-offset-end', value);
  }

  @Input({ alias: 'disableReached', transform: booleanAttribute })
  set disableReachedSetter(value: boolean) {
    this.disabled.set(value);
  }

  @Output() reachedTop: EventEmitter<void> = new EventEmitter<void>();
  @Output() reachedBottom: EventEmitter<void> = new EventEmitter<void>();
  @Output() reachedStart: EventEmitter<void> = new EventEmitter<void>();
  @Output() reachedEnd: EventEmitter<void> = new EventEmitter<void>();

  /** A mapper function to ease forwarding the intersected element to its proper output */
  readonly reachedEventActions: Record<string, ReachedEventAction> = {
    top: { emit: (): void => this.scrollbar.isVerticallyScrollable() ? this.reachedTop.emit() : null },
    bottom: { emit: (): void => this.scrollbar.isVerticallyScrollable() ? this.reachedBottom.emit() : null },
    start: { emit: (): void => this.scrollbar.isHorizontallyScrollable() ? this.reachedStart.emit() : null },
    end: { emit: (): void => this.scrollbar.isHorizontallyScrollable() ? this.reachedEnd.emit() : null }
  };

  private onReached(trigger: string): void {
    if (trigger) {
      this.reachedEventActions[trigger]?.emit();
    }
  }

  private activate(): void {
    this.zone.runOutsideAngular(() => {
      // Create the scrollbars element inside the viewport
      this.triggerElementsWrapper = this.renderer.createElement('div');
      this.renderer.addClass(this.triggerElementsWrapper, 'ng-scroll-reached-wrapper');
      this.renderer.appendChild(this.scrollbar.viewport.contentWrapperElement, this.triggerElementsWrapper);

      // Create a trigger element for each subscribed event
      this.subscribedEvents.forEach((event: string) => {
        const triggerElement: HTMLElement = this.renderer.createElement('div');
        this.renderer.addClass(triggerElement, 'scroll-reached-trigger-element');
        this.renderer.setAttribute(triggerElement, 'trigger', event);
        this.renderer.appendChild(this.triggerElementsWrapper, triggerElement);
        this.triggerElements.push(triggerElement);
      });

      // The first time the observer is triggered as soon as the element is observed,
      // This flag is used to ignore this first trigger
      let intersectionObserverInit: boolean = false;

      this.intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (intersectionObserverInit) {
          entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
              // Forward the detected trigger element only after the observer is initialized
              // Only observe the trigger elements when scrollable
              this.zone.run(() => this.onReached(entry.target.getAttribute('trigger')));
            }
          });
        } else {
          // Once the initial element is detected set a flag to true
          intersectionObserverInit = true;
        }
      }, {
        root: this.scrollbar.viewport.nativeElement,
      });

      this.triggerElements.forEach((el: HTMLElement) => this.intersectionObserver.observe(el));
    });
  }

  private deactivate(): void {
    this.intersectionObserver?.disconnect();
    this.triggerElementsWrapper?.remove();
    this.triggerElements = [];
  }

  private setCssVariable(property: string, value: number): void {
    if (value) {
      this.scrollbar.nativeElement.style.setProperty(property, `${ value }px`);
    }
  }

  ngOnInit(): void {
    if (this.reachedTop.observed) {
      this.subscribedEvents.push('top');
    }
    if (this.reachedBottom.observed) {
      this.subscribedEvents.push('bottom');
    }
    if (this.reachedStart.observed) {
      this.subscribedEvents.push('start');
    }
    if (this.reachedBottom.observed) {
      this.subscribedEvents.push('end');
    }

    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.disabled()) {
          this.deactivate();
        } else {
          if (this.isBrowser) {
            this.activate();
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.deactivate();
  }
}
