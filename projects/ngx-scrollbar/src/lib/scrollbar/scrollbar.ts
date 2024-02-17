import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TrackXDirective, TrackYDirective } from '../track/track';
import { ThumbXDirective, ThumbYDirective } from '../thumb/thumb';
import { ScrollbarAdapter } from './scrollbar-adapter';

@Component({
  standalone: true,
  selector: 'scrollbar-y',
  template: `
    <div #sticky class="ng-scrollbar-sticky">
      <div scrollbarTrackY class="ng-scrollbar-track {{ cmp.trackClass }}">
        <div scrollbarThumbY class="ng-scrollbar-thumb {{ cmp.thumbClass }}"></div>
      </div>
    </div>
  `,
  styleUrls: ['./shared.scss', './vertical.scss'],
  imports: [TrackYDirective, ThumbYDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarY extends ScrollbarAdapter {

  @ViewChild(TrackYDirective, { static: true }) override readonly track: TrackYDirective;
  @ViewChild(ThumbYDirective, { static: true }) override readonly thumb: ThumbYDirective;

}

@Component({
  standalone: true,
  selector: 'scrollbar-x',
  template: `
    <div #sticky class="ng-scrollbar-sticky">
      <div scrollbarTrackX class="ng-scrollbar-track {{ cmp.trackClass }}">
        <div scrollbarThumbX class="ng-scrollbar-thumb {{ cmp.thumbClass }}"
             [attr.dir]="cmp.direction()"></div>
      </div>
    </div>
  `,
  styleUrls: ['./shared.scss', './horizontal.scss'],
  imports: [TrackXDirective, ThumbXDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarX extends ScrollbarAdapter {

  @ViewChild(TrackXDirective, { static: true }) override readonly track: TrackXDirective;
  @ViewChild(ThumbXDirective, { static: true }) override readonly thumb: ThumbXDirective;

}
