import { Directive, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[hideNativeScrollbar]',
  host: {
    '[attr.style]': 'sanitizer.bypassSecurityTrustStyle(nativeScrollbarSize)'
  }
})
export class HideNativeScrollbar {

  @Input('hideNativeScrollbar') size: number;

  get nativeScrollbarSize(): string {
    return `--native-scrollbar-size: -${this.size}px`;
  }

  constructor(public sanitizer: DomSanitizer) {
  }
}
