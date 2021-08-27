import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { PortalModule } from '@angular/cdk/portal';
import { PlatformModule } from '@angular/cdk/platform';
import { SmoothScrollModule } from 'ngx-scrollbar/smooth-scroll';

import { NgScrollbar } from './ng-scrollbar';
import { HideNativeScrollbar } from './hide-native-scrollbar/hide-native-scrollbar';
import { NgAttr } from './utils/ng-attr.directive';
import { ResizeSensor } from './resize-sensor/resize-sensor.directive';
import { ThumbYDirective, ThumbXDirective } from './scrollbar/thumb/thumb.directive';
import { TrackXDirective, TrackYDirective } from './scrollbar/track/track.directive';
import { ScrollbarX, ScrollbarY } from './scrollbar/scrollbar.component';
import { ScrollViewport } from './scroll-viewport';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from './ng-scrollbar.model';

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
    HideNativeScrollbar,
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
  static withConfig(options: NgScrollbarOptions): ModuleWithProviders<NgScrollbarModule> {
    return {
      ngModule: NgScrollbarModule,
      providers: [
        { provide: NG_SCROLLBAR_OPTIONS, useValue: options }
      ]
    };
  }
}
