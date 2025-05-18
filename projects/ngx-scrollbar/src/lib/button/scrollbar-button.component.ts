import { Component, effect, untracked, input, InputSignal, ChangeDetectionStrategy } from '@angular/core';
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

type CanScrollFn = (offset: number, scrollMax?: number) => boolean;

type ScrollStepFn = (scrollBy: number, offset: number, scrollMax: number) => number;

// canScroll function can work for y-axis and x-axis for both LTR and RTL directions
const canScrollFunc: Record<'forward' | 'backward', CanScrollFn> = {
  forward: (scrollOffset: number, scrollMax: number): boolean => scrollOffset < scrollMax,
  backward: (scrollOffset: number): boolean => scrollOffset > 0
}

const scrollStepFunc: Record<'forward' | 'backward', ScrollStepFn> = {
  forward: (scrollBy: number, offset: number) => offset + scrollBy,
  backward: (scrollBy: number, offset: number) => offset - scrollBy
};

const horizontalScrollStepFunc: Record<'ltr' | 'rtl', Record<'forward' | 'backward', ScrollStepFn>> = {
  rtl: {
    forward: (scrollBy: number, offset: number, scrollMax: number) => scrollMax - offset - scrollBy,
    backward: (scrollBy: number, offset: number, scrollMax: number) => scrollMax - offset + scrollBy
  },
  ltr: scrollStepFunc
}

@Component({
  selector: 'button[scrollbarButton]',
  templateUrl: './scrollbar-button.component.html',
  styleUrl: './scrollbar-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarButton extends PointerEventsAdapter {

  scrollbarButton: InputSignal<'top' | 'bottom' | 'start' | 'end'> = input.required();
  scrollDirection: InputSignal<'forward' | 'backward'> = input.required();

  private afterFirstClickDelay: number = 120;
  private firstClickDuration: number = 100;
  private scrollBy: number = 50;
  private onGoingScrollBy: number = 12;

  private nextStep: (scrollBy: number, offset: number, scrollMax: number) => number;
  private canScroll: (offset: number, scrollMax: number) => boolean;

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

  constructor() {
    effect(() => {
      const scrollDirection: 'forward' | 'backward' = this.scrollDirection();
      const dir: Direction = this.adapter.direction();

      untracked(() => {
        // Get the canScroll function according to the scroll direction (forward/backward)
        this.canScroll = canScrollFunc[scrollDirection];

        if (this.control.axis === 'x') {
          // Get the nextStep function according to the scroll direction (forward/backward) and layout direction (LTR/RTL)
          this.nextStep = horizontalScrollStepFunc[dir][scrollDirection];
        } else {
          // Get the nextStep function according to the scroll direction (forward/backward)
          this.nextStep = scrollStepFunc[scrollDirection];
        }
      });
    });
    super();
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
