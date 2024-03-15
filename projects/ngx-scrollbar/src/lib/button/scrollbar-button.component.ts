import {
  Component,
  Input,
  effect,
  inject,
  runInInjectionContext,
  OnInit,
  Injector,
  ChangeDetectionStrategy
} from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import {
  Observable,
  tap,
  delay,
  merge,
  switchMap,
  fromEvent,
  takeUntil,
  interval,
  takeWhile,
  animationFrameScheduler
} from 'rxjs';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { PointerEventsAdapter } from '../utils/pointer-events-adapter';

@Component({
  standalone: true,
  selector: 'button[scrollbarButton]',
  templateUrl: './scrollbar-button.component.html',
  styleUrl: './scrollbar-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarButton extends PointerEventsAdapter implements OnInit {

  private readonly injector: Injector = inject(Injector);

  @Input({ required: true }) scrollbarButton: 'top' | 'bottom' | 'start' | 'end';
  @Input({ required: true }) scrollDirection: 'forward' | 'backward';

  private afterFirstClickDelay: number = 120;
  private firstClickDuration: number = 100;
  private scrollBy: number = 50;
  private onGoingScrollBy: number = 12;

  private nextStep: (scrollBy: number, offset: number, scrollMax: number) => number;
  private canScroll: (offset: number, scrollMax: number) => boolean;

  // canScroll function can work for y-axis and x-axis for both LTR and RTL directions
  private readonly canScrollFunc: Record<'forward' | 'backward', (offset: number, scrollMax?: number) => boolean> = {
    forward: (scrollOffset: number, scrollMax: number): boolean => Math.abs(scrollOffset) < scrollMax,
    backward: (scrollOffset: number): boolean => Math.abs(scrollOffset) > 0
  }

  private scrollStepFunc: Record<'forward' | 'backward', (scrollBy: number, offset: number, scrollMax: number) => number> = {
    forward: (scrollBy: number, offset: number) => offset + scrollBy,
    backward: (scrollBy: number, offset: number) => offset - scrollBy
  };

  private readonly horizontalScrollStepFunc: Record<'ltr' | 'rtl', typeof this.scrollStepFunc> = {
    rtl: {
      forward: (scrollBy: number, offset: number, scrollMax: number) => scrollMax + offset - scrollBy,
      backward: (scrollBy: number, offset: number, scrollMax: number) => scrollMax + offset + scrollBy
    },
    ltr: this.scrollStepFunc
  }

  get pointerEvents(): Observable<PointerEvent> {
    const pointerDown$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerdown').pipe(
      stopPropagation(),
      preventSelection(this.document)
    );
    const pointerUp$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { passive: true }).pipe(
      enableSelection(this.document)
    );

    const pointerLeave$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerleave', { passive: true });

    // Combine pointerup and pointerleave events into one stream
    const pointerUpOrLeave$: Observable<PointerEvent> = merge(pointerUp$, pointerLeave$);

    return pointerDown$.pipe(
      switchMap(() => this.firstScrollStep().pipe(
        delay(this.afterFirstClickDelay),
        switchMap(() => this.onOngoingPointerdown()),
        takeUntil(pointerUpOrLeave$),
      ))
    );
  }

  ngOnInit(): void {
    // Get the canScroll function according to scroll direction (forward/backward)
    this.canScroll = this.canScrollFunc[this.scrollDirection];

    if (this.control.axis === 'x') {
      runInInjectionContext(this.injector, () => {
        effect(() => {
          const dir: Direction = this.cmp.direction();
          // Get the nextStep function according to scroll direction (forward/backward) and layout direction (LTR/RTL)
          this.nextStep = this.horizontalScrollStepFunc[dir][this.scrollDirection];
        });
      });
    } else {
      // Get the nextStep function according to scroll direction (forward/backward)
      this.nextStep = this.scrollStepFunc[this.scrollDirection];
    }
  }

  private firstScrollStep(): Observable<void> {
    const value: number = this.nextStep(this.scrollBy, this.control.viewportScrollOffset, this.control.viewportScrollMax);
    return this.control.scrollTo(value, this.firstClickDuration);
  }

  private onGoingScrollStep(): void {
    const scrollMax: number = this.control.viewportScrollMax;
    const value: number = this.nextStep(this.onGoingScrollBy, this.control.viewportScrollOffset, scrollMax);
    this.control.instantScrollTo(value, scrollMax);
  }

  private onOngoingPointerdown(): Observable<PointerEvent> {
    return interval(0, animationFrameScheduler).pipe(
      takeWhile(() => this.canScroll(this.control.viewportScrollOffset, this.control.viewportScrollMax)),
      tap(() => this.onGoingScrollStep())
    ) as Observable<PointerEvent>;
  }
}
