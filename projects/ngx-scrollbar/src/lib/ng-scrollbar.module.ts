import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { PortalModule } from '@angular/cdk/portal';
import { PlatformModule } from '@angular/cdk/platform';
import { SmoothScrollModule } from 'ngx-scrollbar/smooth-scroll';
// Uncomment the following line in development mode
// import { SmoothScrollModule } from '../../smooth-scroll/src/public_api';

import { NgScrollbar } from './ng-scrollbar';
import { ScrollbarControl } from './scrollbar-control/scrollbar-control';
import { ScrollViewport } from './scroll-viewport';
import { CssVariable } from './utils/css-variable.pipe';
import { NgAttr } from './utils/ng-attr.directive';
import { ResizeSensor } from './utils/resize-sensor.directive';

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
    CssVariable,
    NgAttr,
    ResizeSensor
  ],
  exports: [
    NgScrollbar,
    ScrollViewport
  ]
})
export class NgScrollbarModule {
}
