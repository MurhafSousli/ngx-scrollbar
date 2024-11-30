import {
  Directive,
  inject,
  afterRenderEffect,
  OnInit,
  NgZone,
  Renderer2,
  EventEmitter,
  EffectCleanupRegisterFn,
  InputSignalWithTransform
} from '@angular/core';
import { _NgScrollbar, NG_SCROLLBAR } from 'ngx-scrollbar';

type EventAction = {
  emit: () => void;
}

@Directive()
export abstract class ReachedDroppedBase implements OnInit {

  protected readonly zone: NgZone = inject(NgZone);

  protected readonly renderer: Renderer2 = inject(Renderer2);

  protected readonly scrollbar: _NgScrollbar = inject(NG_SCROLLBAR, { self: true });

  /** An array that contains all trigger elements  **/
  protected triggerElements: HTMLElement[] = [];

  /** The intersection observer reference */
  protected intersectionObserver: IntersectionObserver;

  /** An array that contains the chosen outputs */
  protected subscribedEvents: string[] = [];

  /** The wrapper element that contains the trigger elements */
  protected triggerElementsWrapper: HTMLElement;

  /** The wrapper element class name */
  protected abstract triggerElementsWrapperClass: string;

  /** The trigger element class name */
  protected abstract triggerElementClass: string;

  abstract disabled: InputSignalWithTransform<boolean, string | boolean>;

  abstract top: EventEmitter<void>;

  abstract bottom: EventEmitter<void>;

  abstract start: EventEmitter<void>;

  abstract end: EventEmitter<void>;

  protected abstract isTriggered(entry: IntersectionObserverEntry): boolean;

  /** A mapper function to ease forwarding the intersected element to its proper output */
  readonly eventActions: Record<string, EventAction> = {
    top: { emit: (): void => this.scrollbar.isVerticallyScrollable() ? this.top.emit() : null },
    bottom: { emit: (): void => this.scrollbar.isVerticallyScrollable() ? this.bottom.emit() : null },
    start: { emit: (): void => this.scrollbar.isHorizontallyScrollable() ? this.start.emit() : null },
    end: { emit: (): void => this.scrollbar.isHorizontallyScrollable() ? this.end.emit() : null }
  };

  constructor() {
    afterRenderEffect({
      earlyRead: (onCleanUp: EffectCleanupRegisterFn): void => {
        if (!this.disabled() && this.scrollbar.viewport.initialized()) {
          this.activate();
        }
        onCleanUp(() => this.deactivate())
      }
    });
  }

  private onAction(trigger: string): void {
    if (trigger) {
      this.eventActions[trigger]?.emit();
    }
  }

  protected setCssVariable(property: string, value: number): void {
    if (value) {
      this.scrollbar.nativeElement.style.setProperty(property, `${ value }px`);
    }
  }

  private activate(): void {
    this.zone.runOutsideAngular(() => {
      // Create the scrollbars element inside the viewport
      this.triggerElementsWrapper = this.renderer.createElement('div');
      this.renderer.addClass(this.triggerElementsWrapper, this.triggerElementsWrapperClass);
      this.renderer.appendChild(this.scrollbar.viewport.contentWrapperElement, this.triggerElementsWrapper);


      // Create a trigger element for each subscribed event
      this.subscribedEvents.forEach((event: string) => {
        const triggerElement: HTMLElement = this.renderer.createElement('div');
        this.renderer.addClass(triggerElement, this.triggerElementClass);
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
            if (this.isTriggered(entry)) {
              // Forward the detected trigger element only after the observer is initialized
              // Only observe the trigger elements when scrollable
              this.zone.run(() => this.onAction(entry.target.getAttribute('trigger')));
            }
          });
        } else {
          // Once the initial element is detected set a flag to true
          intersectionObserverInit = true;
        }
      }, {
        root: this.scrollbar.viewport.nativeElement
      });

      this.triggerElements.forEach((el: HTMLElement) => this.intersectionObserver.observe(el));
    });
  }

  private deactivate(): void {
    this.intersectionObserver?.disconnect();
    this.triggerElementsWrapper?.remove();
    this.triggerElements = [];
  }

  ngOnInit(): void {
    if (this.top.observed) {
      this.subscribedEvents.push('top');
    }
    if (this.bottom.observed) {
      this.subscribedEvents.push('bottom');
    }
    if (this.start.observed) {
      this.subscribedEvents.push('start');
    }
    if (this.end.observed) {
      this.subscribedEvents.push('end');
    }
  }
}
