import { Directive } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Observable, EMPTY, fromEvent, merge, of, map, switchMap, tap } from 'rxjs';
import { preventSelection, enableSelection, stopPropagation } from '../common';
import { NgScrollbarBase } from '../../ng-scrollbar-base';

// @dynamic
@Directive()
export abstract class TrackAdapter {

  // Stream that emits when the track element is clicked
  get clicked(): Observable<MouseEvent> {
    const mouseDown = fromEvent<MouseEvent>(this.trackElement, 'mousedown', { passive: true }).pipe(
      stopPropagation(),
      preventSelection(this.document)
    );
    const mouseup = fromEvent<MouseEvent>(this.document, 'mouseup', { passive: true }).pipe(
      stopPropagation(),
      enableSelection(this.document),
      switchMap(() => EMPTY)
    );
    return merge(mouseDown, mouseup);
  }

  // Returns either 'pageX' or 'pageY' according to scrollbar axis
  abstract get pageProperty(): string;

  // Returns the track size, clientHeight or clientWidth
  abstract get size(): number;

  // Returns the start offset either 'clientRect.top' or 'clientRect.left'
  abstract get offset(): number;

  // Get track client rect
  get clientRect(): DOMRect {
    return this.trackElement.getBoundingClientRect();
  }

  protected constructor(protected cmp: NgScrollbarBase,
                        protected trackElement: HTMLElement,
                        protected document: Document) {
  }

  /**
   * Stream that emits when scrollbar track is clicked
   */
  onTrackClicked(e: MouseEvent, thumbSize: number, scrollSize: number): Observable<number> {
    return of(e).pipe(
      map((e: MouseEvent) => e[this.pageProperty]),
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
