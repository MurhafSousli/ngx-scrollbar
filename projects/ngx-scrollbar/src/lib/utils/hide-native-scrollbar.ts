import { Directive, Input, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[hideNativeScrollbar]'
})
export class HideNativeScrollbar {

  el: HTMLElement;

  @Input('hideNativeScrollbar') setSize(size: number) {
    console.log('hideNativeScrollbar', size);
    this.el.style.setProperty('--native-scrollbar-size', `-${size}px`);
  }

  constructor(el: ElementRef, public sanitizer: DomSanitizer) {
    this.el = el.nativeElement;
  }
}
