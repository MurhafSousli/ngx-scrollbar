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

  readonly cssLengthProperty: string = '--track-x-length';

  readonly clientProperty: string = 'clientX';

  get offset(): number {
    return this.clientRect.left;
  }

  get size(): number {
    return this.nativeElement.clientWidth;
  }

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.contentWidth;
  }

  protected get viewportSize(): number {
    return this.cmp.viewport.offsetWidth;
  }

  protected get viewportScrollOffset(): number {
    return this.cmp.viewport.scrollLeft;
  }

  protected getScrollDirection(position: number): 'forward' | 'backward' {
    if (this.cmp.direction() === 'rtl') {
      return position - this.thumb.offset < 0 ? 'forward' : 'backward';
    }
    return position - this.thumb.offset > 0 ? 'forward' : 'backward';
  }

  protected scrollTo(left: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ left }));
  }
}

@Directive({
  standalone: true,
  selector: '[scrollbarTrackY]',
  providers: [{ provide: TrackAdapter, useExisting: TrackYDirective }]
})
export class TrackYDirective extends TrackAdapter {

  readonly cssLengthProperty: string = '--track-y-length';

  readonly clientProperty: string = 'clientY';

  get offset(): number {
    return this.clientRect.top;
  }

  get size(): number {
    return this.nativeElement.clientHeight;
  }

  protected get viewportScrollSize(): number {
    return this.cmp.viewport.contentHeight;
  }

  protected get viewportSize(): number {
    return this.cmp.viewport.offsetHeight;
  }

  protected get viewportScrollOffset(): number {
    return this.cmp.viewport.scrollTop;
  }

  protected getScrollDirection(position: number): 'forward' | 'backward' {
    return position - this.thumb.offset > 0 ? 'forward' : 'backward';
  }

  protected scrollTo(top: number): Observable<void> {
    return fromPromise(this.cmp.scrollTo({ top }));
  }
}
