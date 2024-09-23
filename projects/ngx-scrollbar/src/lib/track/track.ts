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

  protected get contentSize(): number {
    return this.cmp.viewport.contentWidth;
  }

  getCurrPosition: () => number;

  getScrollDirection: (position: number) => 'forward' | 'backward';

  constructor() {
    effect(() => {
      if (this.cmp.direction() === 'rtl') {
        this.getCurrPosition = (): number => {
          const offset: number = this.contentSize - this.viewportSize - this.control.viewportScrollOffset;
          return offset * this.size / this.contentSize;
        };
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          return position < this.getCurrPosition() ? 'forward' : 'backward';
        };
      } else {
        this.getCurrPosition = (): number => {
          return this.control.viewportScrollOffset * this.size / this.contentSize;
        };
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          return position > this.getCurrPosition() ? 'forward' : 'backward';
        };
      }
    });
    super();
  }

  protected scrollTo(start: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ start, duration: this.cmp.trackScrollDuration() }));
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

  protected get contentSize(): number {
    return this.cmp.viewport.contentHeight;
  }

  protected getCurrPosition(): number {
    return this.control.viewportScrollOffset * this.size / this.contentSize;
  }

  protected getScrollDirection(position: number): 'forward' | 'backward' {
    return position > this.getCurrPosition() ? 'forward' : 'backward';
  }

  protected scrollTo(top: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ top, duration: this.cmp.trackScrollDuration() }));
  }

  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}
