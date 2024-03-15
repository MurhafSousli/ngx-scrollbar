import { Directive } from '@angular/core';
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

  get offset(): number {
    return this.clientRect.left;
  }

  get size(): number {
    return this.clientRect.width;
  }

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.contentWidth;
  }

  protected get viewportSize(): number {
    return this.cmp.viewport.offsetWidth;
  }

  protected getScrollDirection(position: number): 'forward' | 'backward' {
    if (this.cmp.direction() === 'rtl') {
      return position - this.thumb.offset < 0 ? 'forward' : 'backward';
    }
    return position - this.thumb.offset > 0 ? 'forward' : 'backward';
  }

  protected scrollTo(left: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ left, duration: this.cmp.trackScrollDuration }));
  }

  protected getScrollForwardIncrement(): number {
    if (this.cmp.direction() === 'rtl') {
      const position: number = -(this.control.viewportScrollOffset - this.viewportSize);
      return this.scrollMax - position;
    }
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardIncrement(): number {
    if (this.cmp.direction() === 'rtl') {
      const position: number = -(this.control.viewportScrollOffset + this.viewportSize);
      return this.scrollMax - position;
    }
    return this.control.viewportScrollOffset - this.viewportSize;
  }

  protected getOnGoingScrollForward(): { position: number, nextPosition: number, endPosition: number } {
    if (this.cmp.direction() === 'rtl') {
      const position: number = this.control.viewportScrollOffset - this.viewportSize;
      return {
        position,
        nextPosition: this.scrollMax + position,
        endPosition: 0
      }
    }
    const position: number = this.control.viewportScrollOffset + this.viewportSize;
    return {
      position,
      nextPosition: position,
      endPosition: this.scrollMax
    }
  }

  protected getOnGoingScrollBackward(): { position: number, nextPosition: number, endPosition: number } {
    if (this.cmp.direction() === 'rtl') {
      const position: number = this.control.viewportScrollOffset + this.viewportSize;
      return {
        position,
        nextPosition: this.scrollMax + position,
        endPosition: this.scrollMax
      }
    }
    const position: number = this.control.viewportScrollOffset - this.viewportSize;
    return {
      position,
      nextPosition: position,
      endPosition: 0
    }
  }
}

@Directive({
  standalone: true,
  selector: '[scrollbarTrackY]',
  providers: [{ provide: TrackAdapter, useExisting: TrackYDirective }]
})
export class TrackYDirective extends TrackAdapter {

  protected readonly cssLengthProperty: string = '--track-y-length';

  get offset(): number {
    return this.clientRect.top;
  }

  get size(): number {
    return this.clientRect.height;
  }

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.contentHeight;
  }

  protected get viewportSize(): number {
    return this.cmp.viewport.offsetHeight;
  }

  protected getScrollDirection(position: number): 'forward' | 'backward' {
    return position - this.thumb.offset > 0 ? 'forward' : 'backward';
  }

  protected scrollTo(top: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ top, duration: this.cmp.trackScrollDuration }));
  }

  protected getScrollForwardIncrement(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardIncrement(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }

  protected getOnGoingScrollForward(): { position: number, nextPosition: number, endPosition: number } {
    const position: number = this.control.viewportScrollOffset + this.viewportSize;
    return {
      position,
      nextPosition: position,
      endPosition: this.scrollMax
    }
  }

  protected getOnGoingScrollBackward(): { position: number, nextPosition: number, endPosition: number } {
    const position: number = this.control.viewportScrollOffset - this.viewportSize;
    return {
      position,
      nextPosition: position,
      endPosition: 0
    }
  }
}
