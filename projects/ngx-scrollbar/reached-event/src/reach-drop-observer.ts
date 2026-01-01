import {
  Component,
  inject,
  input,
  output,
  viewChildren,
  afterNextRender,
  Signal,
  NgZone,
  OnDestroy,
  ElementRef,
  InputSignal,
  OutputEmitterRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ViewportAdapter } from 'ngx-scrollbar';
import { ReachedEvent } from './reached.model';

@Component({
  host: {
    '[attr.isVerticallyScrollable]': 'viewport.isVerticallyScrollable()',
    '[attr.isHorizontallyScrollable]': 'viewport.isHorizontallyScrollable()',
  },
  selector: 'scroll-reached',
  template: `
    @for (event of selectedEvents(); track $index) {
      <div #detectElement
           class="scroll-trigger-element"
           [attr.name]="event.name"
           [attr.event]="event.type"
           [attr.trigger]="event.trigger"></div>
    }
  `,
  styleUrl: './reach-drop-observer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReachDropObserver implements OnDestroy {

  private zone: NgZone = inject(NgZone);

  viewport: ViewportAdapter = inject(ViewportAdapter);

  /** The intersection observer reference */
  private intersectionObserver: IntersectionObserver;

  events: OutputEmitterRef<string> = output<string>();

  selectedEvents: InputSignal<ReachedEvent[]> = input<ReachedEvent[]>();

  triggerElements: Signal<readonly ElementRef[]> = viewChildren<ElementRef>('detectElement');

  constructor() {
    afterNextRender({
      earlyRead: () => {
        this.zone.runOutsideAngular(() => {
          // The first time the observer is triggered as soon as the element is observed,
          // This flag is used to ignore this first trigger
          let intersectionObserverInit: boolean = false;

          this.intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (intersectionObserverInit) {
              entries.forEach((entry: IntersectionObserverEntry) => {
                const entryType: string = entry.target.getAttribute('event');
                if ((entryType === 'reached' && entry.isIntersecting) || (entryType === 'dropped' && !entry.isIntersecting)) {
                  // Forward the detected trigger element only after the observer is initialized
                  // Only observe the trigger elements when scrollable
                  this.zone.run(() => this.events.emit(entry.target.getAttribute('name')));
                }
              });
            } else {
              // Once the initial element is detected, set a flag to true
              intersectionObserverInit = true;
            }
          }, {
            root: this.viewport.viewportElement
          });

          this.triggerElements().forEach((el: ElementRef<HTMLElement>) => {
            this.intersectionObserver.observe(el.nativeElement);
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
  }
}
