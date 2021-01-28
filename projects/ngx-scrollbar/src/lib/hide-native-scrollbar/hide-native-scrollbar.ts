import { Directive, ElementRef, Renderer2, RendererStyleFlags2, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NativeScrollbarSizeFactory } from './native-scrollbar-size-factory';

@Directive({
  selector: '[hideNativeScrollbar]'
})
export class HideNativeScrollbar implements OnDestroy {

  private readonly _subscriber = Subscription.EMPTY;

  constructor(el: ElementRef,
              private renderer: Renderer2,
              private hideNativeScrollbar: NativeScrollbarSizeFactory) {
    this._subscriber = hideNativeScrollbar.scrollbarSize.subscribe((size: number) => {
      this.renderer.setStyle(el.nativeElement, '--native-scrollbar-size', `-${ size }px`, RendererStyleFlags2.DashCase);
    });
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }
}
