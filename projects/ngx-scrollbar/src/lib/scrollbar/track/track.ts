import { coerceNumberProperty } from '@angular/cdk/coercion';
import { EMPTY, fromEvent, merge, Observable, of } from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/operators';
import { preventSelection, enableSelection, stopPropagation } from '../common';
import { NgScrollbar } from '../../ng-scrollbar';

export abstract class TrackAdapter {

  // Stream that emits when the track element is clicked
  get clicked(): Observable<any> {
    const mouseDown = fromEvent(this.trackElement, 'mousedown', { passive: true }).pipe(
      stopPropagation(),
      preventSelection(this.document)
    );
    const mouseup = fromEvent(this.document, 'mouseup', { passive: true }).pipe(
      stopPropagation(),
      enableSelection(this.document),
      switchMap(() => EMPTY)
    );
    return merge(mouseDown, mouseup);
  }

  // Stream that emits when the track element is hovered
  get hovered(): Observable<boolean> {
    const mouseEnter = fromEvent(this.trackElement, 'mouseenter', { passive: true }).pipe(
      stopPropagation(),
      map(() => true)
    );
    const mouseLeave = fromEvent(this.trackElement, 'mouseleave', { passive: true }).pipe(
      stopPropagation(),
      map(() => false)
    );
    return merge(mouseEnter, mouseLeave);
  }

  // Returns either 'pageX' or 'pageY' according to scrollbar axis
  abstract get pageProperty(): string;

  // Returns the track size, clientHeight or clientWidth
  abstract get size(): number;

  // Returns the start offset either 'clientRect.top' or 'clientRect.left'
  abstract get offset(): number;

  // Get track client rect
  get clientRect(): ClientRect {
    return this.trackElement.getBoundingClientRect();
  }

  protected constructor(protected cmp: NgScrollbar,
                        protected trackElement: HTMLElement,
                        protected document: any) {
  }

  /**
   * Stream that emits when scrollbar track is clicked
   */
  onTrackClicked(e: any, thumbSize: number, scrollSize: number): Observable<any> {
    return of(e).pipe(
      pluck(this.pageProperty),
      // Calculate scrollTo position
      map((pageOffset: number) => {
        const clickOffset = pageOffset - this.offset;
        const offset = clickOffset - (thumbSize / 2);
        const ratio = offset / this.size;
        return ratio * scrollSize;
      }),
      // Smooth scroll to position
      tap((value: number) => {
        this.cmp.scrollTo({
          ...this.mapToScrollToOption(value),
          duration: coerceNumberProperty(this.cmp.trackClickScrollDuration)
        });
      })
    );
  }

  protected abstract mapToScrollToOption(value: number): ScrollToOptions;
}
