import { Component, effect, ChangeDetectionStrategy } from '@angular/core';
import { Observable, from } from 'rxjs';
import { TrackAdapter } from './track-adapter';

@Component({
  selector: 'scrollbar-track-y',
  template: '<ng-content/>',
  styleUrl: './track.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TrackAdapter, useExisting: TrackYComponent }]
})
export class TrackYComponent extends TrackAdapter {

  protected get contentSize(): number {
    return this.adapter.contentHeight;
  }

  protected getThumbStartPosition(): number {
    return this.control.viewportScrollOffset * this.size / this.contentSize;
  }

  protected getThumbEndPosition(): number {
    return (this.control.viewportScrollOffset + this.viewportSize) * this.size / this.contentSize;
  }

  getScrollDirection(position: number): 'forward' | 'backward' {
    if (position > this.getThumbEndPosition()) {
      return 'forward';
    } else if (position < this.getThumbStartPosition()) {
      return 'backward';
    }
    return null;
  }

  protected scrollTo(top: number): Observable<void> {
    return from(this.adapter.scrollTo({ top, duration: this.adapter.trackScrollDuration() }));
  }

  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}

@Component({
  selector: 'scrollbar-track-x',
  template: '<ng-content/>',
  styleUrl: './track.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TrackAdapter, useExisting: TrackXComponent }]
})
export class TrackXComponent extends TrackAdapter {

  protected get contentSize(): number {
    return this.adapter.contentWidth;
  }

  getThumbStartPosition: () => number;

  getThumbEndPosition: () => number;

  getScrollDirection: (position: number) => 'forward' | 'backward';

  constructor() {
    effect(() => {
      if (this.adapter.direction() === 'rtl') {
        this.getThumbStartPosition = (): number => {
          const offset: number = this.contentSize - this.viewportSize - this.control.viewportScrollOffset;
          return offset * this.size / this.contentSize;
        };
        this.getThumbEndPosition = (): number => {
          const offset: number = this.contentSize - this.control.viewportScrollOffset;
          return offset * this.size / this.contentSize;
        }
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          if (position < this.getThumbStartPosition()) {
            return 'forward';
          } else if (position > this.getThumbEndPosition()) {
            return 'backward';
          }
          return null;
        };
      } else {
        this.getThumbStartPosition = (): number => {
          return this.control.viewportScrollOffset * this.size / this.contentSize;
        };
        this.getThumbEndPosition = (): number => {
          return (this.control.viewportScrollOffset + this.viewportSize) * this.size / this.contentSize;
        }
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          if (position > this.getThumbEndPosition()) {
            return 'forward';
          } else if (position < this.getThumbStartPosition()) {
            return 'backward';
          }
          return null;
        };
      }
    });
    super();
  }

  protected scrollTo(start: number): Observable<void> {
    return from(this.adapter.scrollTo({ start, duration: this.adapter.trackScrollDuration() }));
  }

  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}
