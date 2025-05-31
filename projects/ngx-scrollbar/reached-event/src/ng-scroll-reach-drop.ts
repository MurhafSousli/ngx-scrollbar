import {
  Directive,
  inject,
  effect,
  Output,
  createComponent,
  numberAttribute,
  input,
  EventEmitter,
  Injector,
  Renderer2,
  ComponentRef,
  ApplicationRef,
  EffectCleanupRegisterFn,
  InputSignalWithTransform,
  ElementRef
} from '@angular/core';
import { ViewportAdapter } from 'ngx-scrollbar';
import { ReachDropObserver } from './reach-drop-observer';
import { ReachedEvent } from './reached.model';

@Directive({
  selector: `
    ng-scrollbar[reachedTop], ng-scrollbar[reachedBottom], ng-scrollbar[reachedStart], ng-scrollbar[reachedEnd],
    ng-scrollbar[droppedTop], ng-scrollbar[droppedBottom], ng-scrollbar[droppedStart], ng-scrollbar[droppedEnd]
  `
})
export class NgScrollReachDrop {

  private renderer: Renderer2 = inject(Renderer2);

  private injector: Injector = inject(Injector);

  private appRef: ApplicationRef = inject(ApplicationRef);

  private viewport: ViewportAdapter = inject(ViewportAdapter);

  private nativeElement: HTMLElement = inject(ElementRef).nativeElement;

  /** Reached offset value in px */
  reachedTopOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  reachedBottomOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  reachedStartOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  reachedEndOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  /** Dropped offset value in px */
  droppedTopOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  droppedBottomOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  droppedStartOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  droppedEndOffset: InputSignalWithTransform<number, string | number> = input<number, string | number>(0, {
    transform: numberAttribute
  });

  disableReached: InputSignalWithTransform<boolean, string | boolean> = input<boolean>(false);

  disableDropped: InputSignalWithTransform<boolean, string | boolean> = input<boolean>(false);

  @Output() reachedTop: EventEmitter<void> = new EventEmitter<void>();

  @Output() reachedBottom: EventEmitter<void> = new EventEmitter<void>();

  @Output() reachedStart: EventEmitter<void> = new EventEmitter<void>();

  @Output() reachedEnd: EventEmitter<void> = new EventEmitter<void>();

  @Output() droppedTop: EventEmitter<void> = new EventEmitter<void>();

  @Output() droppedBottom: EventEmitter<void> = new EventEmitter<void>();

  @Output() droppedStart: EventEmitter<void> = new EventEmitter<void>();

  @Output() droppedEnd: EventEmitter<void> = new EventEmitter<void>();

  container: ComponentRef<ReachDropObserver>;

  /** An array that contains the chosen outputs */
  private events: ReachedEvent[] = [];

  constructor() {
    effect(() => {
      this.setCssVariable('--reached-offset-top', this.reachedTopOffset());
      this.setCssVariable('--reached-offset-bottom', this.reachedBottomOffset());
      this.setCssVariable('--reached-offset-start', this.reachedStartOffset());
      this.setCssVariable('--reached-offset-end', this.reachedEndOffset());
      this.setCssVariable('--dropped-offset-top', this.droppedTopOffset());
      this.setCssVariable('--dropped-offset-bottom', this.droppedBottomOffset());
      this.setCssVariable('--dropped-offset-start', this.droppedStartOffset());
      this.setCssVariable('--dropped-offset-end', this.droppedEndOffset());
    });

    effect((onCleanup: EffectCleanupRegisterFn) => {
      if ((this.disableReached() && this.disableDropped()) || !this.viewport.initialized()) return;

      if (!this.disableReached()) {
        if (this.reachedTop.observed) {
          this.events.push({ name: 'reachedTop', trigger: 'top', type: 'reached' });
        }
        if (this.reachedBottom.observed) {
          this.events.push({ name: 'reachedBottom', trigger: 'bottom', type: 'reached' });
        }
        if (this.reachedStart.observed) {
          this.events.push({ name: 'reachedStart', trigger: 'start', type: 'reached' });
        }
        if (this.reachedEnd.observed) {
          this.events.push({ name: 'reachedEnd', trigger: 'end', type: 'reached' });
        }
      }

      if (!this.disableDropped()) {
        if (this.droppedTop.observed) {
          this.events.push({ name: 'droppedTop', trigger: 'top', type: 'dropped' });
        }
        if (this.droppedBottom.observed) {
          this.events.push({ name: 'droppedBottom', trigger: 'bottom', type: 'dropped' });
        }
        if (this.droppedStart.observed) {
          this.events.push({ name: 'droppedStart', trigger: 'start', type: 'dropped' });
        }
        if (this.droppedEnd.observed) {
          this.events.push({ name: 'droppedEnd', trigger: 'end', type: 'dropped' });
        }
      }

      this.container = createComponent(ReachDropObserver, {
        elementInjector: this.injector,
        environmentInjector: this.appRef.injector
      });

      // Forward the observed outputs
      this.container.instance.selectedEvents = this.events;

      // Forward the events to the appropriate output
      this.container.instance.events.subscribe((trigger: string) => {
        (this[trigger] as EventEmitter<void>).emit();
      });

      this.renderer.appendChild(this.viewport.contentWrapperElement, this.container.location.nativeElement);
      // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks run.
      this.appRef.attachView(this.container.hostView);

      onCleanup(() => {
        this.events = [];
        this.container.destroy();
        this.container = null;
      });
    });
  }

  private setCssVariable(property: string, value: number): void {
    if (value) {
      this.nativeElement.style.setProperty(property, `${ value }px`);
    }
  }
}
