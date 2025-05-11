import { Directive, effect } from '@angular/core';
import { from, Observable } from 'rxjs';
import { TrackAdapter } from './track-adapter';

@Directive({
  selector: '[scrollbarTrackX]',
  providers: [{ provide: TrackAdapter, useExisting: TrackXDirective }]
})
export class TrackXDirective extends TrackAdapter {

  protected get contentSize(): number {
    return this.host.contentWidth;
  }

  getCurrPosition: () => number;

  getScrollDirection: (position: number) => 'forward' | 'backward';

  constructor() {
    effect(() => {
      if (this.host.direction() === 'rtl') {
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
    return from(this.host.scrollTo({ start, duration: this.host.trackScrollDuration() }));
  }

  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}

@Directive({
  selector: '[scrollbarTrackY]',
  providers: [{ provide: TrackAdapter, useExisting: TrackYDirective }]
})
export class TrackYDirective extends TrackAdapter {

  protected get contentSize(): number {
    return this.host.contentHeight;
  }

  protected getCurrPosition(): number {
    return this.control.viewportScrollOffset * this.size / this.contentSize;
  }

  protected getScrollDirection(position: number): 'forward' | 'backward' {
    return position > this.getCurrPosition() ? 'forward' : 'backward';
  }

  protected scrollTo(top: number): Observable<void> {
    return from(this.host.scrollTo({ top, duration: this.host.trackScrollDuration() }));
  }

  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}
