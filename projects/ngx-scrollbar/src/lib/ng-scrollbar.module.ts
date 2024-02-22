import { NgModule, Provider } from '@angular/core';
import { NgScrollbar } from './ng-scrollbar';
import { ScrollViewport } from './viewport';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { NG_SCROLLBAR_OPTIONS, NG_SCROLLBAR_POLYFILL, NgScrollbarOptions } from './ng-scrollbar.model';

@NgModule({
  imports: [
    NgScrollbar,
    ScrollViewport,
    NgScrollbarExt
  ],
  exports: [
    NgScrollbar,
    ScrollViewport,
    NgScrollbarExt
  ]
})
export class NgScrollbarModule {
}

export function provideScrollbarOptions(options: NgScrollbarOptions): Provider[]  {
  return [
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: options
    }
  ]
}

export function provideScrollbarPolyfill(url: string): Provider[]  {
  return [
    {
      provide: NG_SCROLLBAR_POLYFILL,
      useValue: url
    }
  ]
}
