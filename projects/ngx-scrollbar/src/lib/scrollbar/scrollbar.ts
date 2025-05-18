import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SCROLLBAR_CONTROL, ScrollbarAdapter } from './scrollbar-adapter';
import { ScrollbarManager } from '../utils/scrollbar-manager';
import { TrackXComponent, TrackYComponent } from '../track/track';
import { ThumbXComponent, ThumbYComponent } from '../thumb/thumb';
import { ScrollbarButton } from '../button/scrollbar-button.component';

@Component({
  selector: 'scrollbar-y',
  template: `
    <div class="ng-scrollbar-sticky"
         [class.ng-scrollbar-hover]="cmp.hoverOffset()">
      <div class="ng-scrollbar-track-wrapper"
           [class.ng-scrollbar-hover]="!cmp.hoverOffset()">
        <scrollbar-track-y class="ng-scrollbar-track {{ cmp.trackClass() }}">
          <scrollbar-thumb-y class="ng-scrollbar-thumb {{ cmp.thumbClass() }}"/>
        </scrollbar-track-y>
        @if (cmp.buttons()) {
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="top"
                  scrollDirection="backward"></button>
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="bottom"
                  scrollDirection="forward"></button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./shared.scss', './vertical.scss'],
  imports: [TrackYComponent, ThumbYComponent, ScrollbarButton],
  providers: [
    { provide: SCROLLBAR_CONTROL, useExisting: ScrollbarY }
  ],
  host: {
    '[style.--track-size]': 'trackSize()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarY extends ScrollbarAdapter {

  readonly rectOffsetProperty: 'left' | 'top' = 'top';

  readonly rectSizeProperty: 'width' | 'height' = 'height';

  readonly sizeProperty: 'offsetWidth' | 'offsetHeight' = 'offsetHeight';

  readonly clientProperty: 'clientX' | 'clientY' = 'clientY';

  readonly offsetProperty: 'offsetX' | 'offsetY' = 'offsetY';

  readonly axis: 'x' | 'y' = 'y';

  get viewportScrollMax(): number {
    return this.cmp.scrollMaxY;
  }

  get viewportScrollOffset(): number {
    return this.cmp.scrollTop;
  }

  scrollTo(top: number, duration: number): Observable<void> {
    return from(this.cmp.scrollTo({ top, duration }));
  }

  instantScrollTo(value: number): void {
    this.cmp.scrollYTo(value);
  }
}

@Component({
  selector: 'scrollbar-x',
  template: `
    <div class="ng-scrollbar-sticky"
         [class.ng-scrollbar-hover]="cmp.hoverOffset()">
      <div class="ng-scrollbar-track-wrapper"
           [class.ng-scrollbar-hover]="!cmp.hoverOffset()">
        <scrollbar-track-x class="ng-scrollbar-track {{ cmp.trackClass() }}">
          <scrollbar-thumb-x class="ng-scrollbar-thumb {{ cmp.thumbClass() }}" [attr.dir]="cmp.direction()"/>
        </scrollbar-track-x>
        @if (cmp.buttons()) {
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="start"
                  scrollDirection="backward"></button>
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="end"
                  scrollDirection="forward"></button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./shared.scss', './horizontal.scss'],
  imports: [TrackXComponent, ThumbXComponent, ScrollbarButton],
  providers: [
    { provide: SCROLLBAR_CONTROL, useExisting: ScrollbarX }
  ],
  host: {
    '[attr.dir]': 'cmp.direction()',
    '[style.--track-size]': 'trackSize()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarX extends ScrollbarAdapter {

  readonly manager: ScrollbarManager = inject(ScrollbarManager);

  readonly rectOffsetProperty: 'left' | 'top' = 'left';

  readonly rectSizeProperty: 'width' | 'height' = 'width';

  readonly sizeProperty: 'offsetWidth' | 'offsetHeight' = 'offsetWidth';

  readonly clientProperty: 'clientX' | 'clientY' = 'clientX';

  readonly offsetProperty: 'offsetX' | 'offsetY' = 'offsetX';

  readonly axis: 'x' | 'y' = 'x';

  // Handle dragging position (Support LTR and RTL directions for the horizontal scrollbar)
  private handlePosition: (value: number, scrollMax: number) => number;

  get viewportScrollMax(): number {
    return this.cmp.scrollMaxX;
  }

  get viewportScrollOffset(): number {
    // Keep scrollLeft value positive for horizontal scrollbar
    return Math.abs(this.cmp.scrollLeft);
  }

  constructor() {
    effect(() => {
      if (this.cmp.direction() === 'rtl') {
        this.handlePosition = (position: number, scrollMax: number): number => -(scrollMax - position);
      } else {
        this.handlePosition = (position: number): number => position;
      }
    });
    super();
  }

  scrollTo(left: number, duration: number): Observable<void> {
    return from(this.cmp.scrollTo({ left, duration }));
  }

  instantScrollTo(value: number, scrollMax?: number): void {
    this.cmp.scrollXTo(this.handlePosition(value, scrollMax));
  }
}
