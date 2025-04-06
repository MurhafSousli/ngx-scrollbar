import { Provider, EnvironmentProviders, NgModule, makeEnvironmentProviders } from '@angular/core';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { NG_SCROLLBAR_OPTIONS, NG_SCROLLBAR_POLYFILL, NgScrollbarOptions } from './ng-scrollbar.model';
import { AsyncDetection } from './async-detection';
import { defaultOptions } from './ng-scrollbar.default';
import { SyncSpacer } from './sync-spacer';

@NgModule({
  imports: [
    NgScrollbar,
    NgScrollbarExt,
    AsyncDetection,
    SyncSpacer
  ],
  exports: [
    NgScrollbar,
    NgScrollbarExt,
    AsyncDetection,
    SyncSpacer
  ]
})
export class NgScrollbarModule {
}

export function provideScrollbarOptions(options: NgScrollbarOptions): Provider[] {
  return [
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: { ...defaultOptions, ...options }
    }
  ]
}

export function provideScrollbarPolyfill(url: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: NG_SCROLLBAR_POLYFILL,
      useValue: url
    }
  ]);
}
