import { Directive, effect } from '@angular/core';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { TrackAdapter } from './track-adapter';

@Directive({
  standalone: true,
  selector: '[scrollbarTrackX]',
  providers: [{ provide: TrackAdapter, useExisting: TrackXDirective }]
})
export class TrackXDirective extends TrackAdapter {

  protected readonly cssLengthProperty: string = '--track-x-length';

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.contentWidth;
  }

  getCurrPosition: () => number;

  getScrollDirection: (position: number) => 'forward' | 'backward';

  constructor() {
    effect(() => {
      if (this.cmp.direction() === 'rtl') {
        this.getCurrPosition = (): number => {
          const offset: number = this.viewportScrollSize - this.viewportSize - this.control.viewportScrollOffset;
          return offset * this.size / this.viewportScrollSize;
        };
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          return position < this.getCurrPosition() ? 'forward' : 'backward';
        };
      } else {
        this.getCurrPosition = (): number => {
          return this.control.viewportScrollOffset * this.size / this.viewportScrollSize
        };
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          return position > this.getCurrPosition() ? 'forward' : 'backward';
        };
      }
    });
    super();
  }

  protected scrollTo(value: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ start: value, duration: this.cmp.trackScrollDuration }));
  }

  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}

@Directive({
  standalone: true,
  selector: '[scrollbarTrackY]',
  providers: [{ provide: TrackAdapter, useExisting: TrackYDirective }]
})
export class TrackYDirective extends TrackAdapter {

  protected readonly cssLengthProperty: string = '--track-y-length';

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.contentHeight;
  }

  protected getCurrPosition(): number {
    return this.control.viewportScrollOffset * this.size / this.viewportScrollSize;
  }

  protected getScrollDirection(position: number): 'forward' | 'backward' {
    return position > this.getCurrPosition() ? 'forward' : 'backward';
  }

  protected scrollTo(top: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ top, duration: this.cmp.trackScrollDuration }));
  }

  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}
