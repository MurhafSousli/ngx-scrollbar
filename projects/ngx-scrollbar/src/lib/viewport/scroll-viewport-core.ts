// import {
//   afterRenderEffect,
//   Directive,
//   EffectCleanupRegisterFn,
//   ElementRef,
//   inject,
//   NgZone,
//   untracked
// } from '@angular/core';
// import { combineLatest } from 'rxjs';
// import { getThrottledStream } from '../utils/common';
// import { _NgScrollbar, NG_SCROLLBAR, NG_SCROLLBAR_OPTIONS, NgScrollbarOptions } from 'ngx-scrollbar';
// import { SharedResizeObserver } from '@angular/cdk/observers/private';
// import { Platform } from '@angular/cdk/platform';
// import { Directionality } from '@angular/cdk/bidi';
// import { SmoothScrollManager } from 'ngx-scrollbar/smooth-scroll';
// import { ViewportAdapter } from './viewport-adapter';
//
//
// @Directive({
//   host: {
//     '[class.ng-scroll-viewport]': 'true',
//     '[attr.verticalUsed]': 'host.verticalUsed()',
//     '[attr.horizontalUsed]': 'host.horizontalUsed()',
//     '[attr.isVerticallyScrollable]': 'host.isVerticallyScrollable()',
//     '[attr.isHorizontallyScrollable]': 'host.isHorizontallyScrollable()',
//     '[attr.mobile]': 'isMobile',
//     '[attr.dir]': 'host.direction()',
//     '[attr.position]': 'host.position()',
//     '[attr.dragging]': 'host.dragging()',
//     '[attr.appearance]': 'host.appearance()',
//     '[attr.visibility]': 'host.visibility()',
//     '[attr.orientation]': 'host.orientation()',
//     '[attr.disableInteraction]': 'host.disableInteraction()',
//     '[style.--content-height]': 'host.contentDimension().height',
//     '[style.--content-width]': 'host.contentDimension().width',
//     '[style.--viewport-height]': 'host.viewportDimension().height',
//     '[style.--viewport-width]': 'host.viewportDimension().width'
//   }
// })
// export class ScrollViewportCore {
//
//   /** Global options */
//   private readonly options: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS);
//
//   private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);
//
//   private readonly zone: NgZone = inject(NgZone);
//
//   private readonly platform: Platform = inject(Platform);
//
//   /** A flag that indicates if the platform is mobile */
//   readonly isMobile: boolean = this.platform.IOS || this.platform.ANDROID;
//
//   readonly dir: Directionality = inject(Directionality);
//
//   readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);
//
//   /** Viewport adapter instance */
//   readonly viewport: ViewportAdapter = inject(ViewportAdapter, { self: true });
//
//   readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
//
//   readonly host: _NgScrollbar = inject(NG_SCROLLBAR);
//
//   constructor() {
//     afterRenderEffect({
//       earlyRead: (onCleanup: EffectCleanupRegisterFn): void => {
//         const disableSensor: boolean = this.host.disableSensor();
//         const throttleDuration: number = this.host.sensorThrottleTime();
//         const viewportInit: boolean = this.viewport.initialized();
//
//         untracked(() => {
//           if (viewportInit) {
//             // If resize sensor is disabled, update manually the first time
//             if (disableSensor) {
//               requestAnimationFrame(() => this.update(ScrollbarUpdateReason.AfterInit));
//             } else {
//               // Observe size changes for viewport and content wrapper
//               this.zone.runOutsideAngular(() => {
//                 resizeSub$ = getThrottledStream(
//                   combineLatest([
//                     this.sharedResizeObserver.observe(this.viewport.nativeElement),
//                     this.sharedResizeObserver.observe(this.viewport.contentWrapperElement)
//                   ]),
//                   throttleDuration
//                 ).subscribe(() => {
//                   // After deep investigation, it appears that setting the dimension directly from the element properties
//                   // is much faster than to set them from resize callback values
//                   this.zone.run(() => {
//                     this.updateDimensions();
//
//                     if (hasInitialized) {
//                       this.afterUpdate.emit();
//                     } else {
//                       this.afterInit.emit();
//                     }
//                     hasInitialized = true;
//                   });
//                 });
//               });
//             }
//           }
//
//           onCleanup(() => resizeSub$?.unsubscribe());
//         });
//       }
//     })
//   }
// }
