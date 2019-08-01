import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { PortalModule } from '@angular/cdk/portal';
import { PlatformModule } from '@angular/cdk/platform';
import { SmoothScrollModule } from 'ngx-scrollbar/smooth-scroll';

import { NgScrollbar } from './ng-scrollbar';
import { ScrollbarControl } from './scrollbar-control/scrollbar-control';
import { ScrollViewport } from './scroll-viewport';
import { CssVariablePipe } from './utils/css-variable.pipe';
import { NgAttr } from './utils/ng-attr.directive';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from './ng-scrollbar-config';

@NgModule({
  imports: [
    CommonModule,
    BidiModule,
    PortalModule,
    PlatformModule,
    SmoothScrollModule
  ],
  declarations: [
    NgScrollbar,
    ScrollbarControl,
    ScrollViewport,
    CssVariablePipe,
    NgAttr
  ],
  exports: [
    NgScrollbar,
    ScrollViewport
  ]
})
export class NgScrollbarModule {
  static withConfig(options: NgScrollbarOptions): ModuleWithProviders {
    return {
      ngModule: NgScrollbarModule,
      providers: [{ provide: NG_SCROLLBAR_OPTIONS, useValue: options }]
    };
  }
}
