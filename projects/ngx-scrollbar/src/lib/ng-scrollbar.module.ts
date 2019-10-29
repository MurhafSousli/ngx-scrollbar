import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { PortalModule } from '@angular/cdk/portal';
import { PlatformModule } from '@angular/cdk/platform';
import { SmoothScrollModule } from 'ngx-scrollbar/smooth-scroll';
// Uncomment the following line in development mode
// import { SmoothScrollModule } from '../../smooth-scroll/src/public_api';

import { NgScrollbar } from './ng-scrollbar';
import { CssVariable } from './utils/css-variable.pipe';
import { NgAttr } from './utils/ng-attr.directive';
import { ResizeSensor } from './utils/resize-sensor.directive';
import { ThumbYDirective, ThumbXDirective } from './scrollbar/thumb/thumb.directive';
import { TrackXDirective, TrackYDirective } from './scrollbar/track/track.directive';
import { ScrollbarX, ScrollbarY } from './scrollbar/scrollbar';
import { ScrollViewport } from './scroll-viewport';

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
    ScrollViewport,
    CssVariable,
    NgAttr,
    ResizeSensor,
    ThumbYDirective,
    ThumbXDirective,
    TrackXDirective,
    TrackYDirective,
    ScrollbarY,
    ScrollbarX
  ],
  exports: [
    NgScrollbar,
    ScrollViewport
  ]
})
export class NgScrollbarModule {
}
