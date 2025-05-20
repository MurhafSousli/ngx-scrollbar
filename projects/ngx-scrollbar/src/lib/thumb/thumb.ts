import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThumbAdapter } from './thumb-adapter';

@Component({
  selector: 'scrollbar-thumb-y',
  template: '',
  styleUrls: ['./thumb.scss', './thumb-y.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // TODO: Maybe we don't need to provide ThumbAdapter
  providers: [{ provide: ThumbAdapter, useExisting: ThumbYComponent }]
})
export class ThumbYComponent extends ThumbAdapter {
}

@Component({
  selector: 'scrollbar-thumb-x',
  template: '',
  styleUrls: ['./thumb.scss', './thumb-x.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ThumbAdapter, useExisting: ThumbXComponent }]
})
export class ThumbXComponent extends ThumbAdapter {
}
