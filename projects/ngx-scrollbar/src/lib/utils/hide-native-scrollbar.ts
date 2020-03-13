import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NativeScrollbarSizeFactory } from './native-scrollbar-size-factory';

@Directive({
  selector: '[hideNativeScrollbar]'
})
export class HideNativeScrollbar implements OnDestroy {

  private readonly _subscriber = Subscription.EMPTY;

  constructor(el: ElementRef, private hideNativeScrollbar: NativeScrollbarSizeFactory) {
    this._subscriber = hideNativeScrollbar.scrollbarSize.subscribe((size: number) => {
      (el.nativeElement as HTMLElement).style.setProperty('--native-scrollbar-size', `-${ size }px`);
    });
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }
}
