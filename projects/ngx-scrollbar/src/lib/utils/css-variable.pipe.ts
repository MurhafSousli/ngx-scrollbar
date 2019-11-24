import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'cssVariable'
})
export class CssVariable implements PipeTransform {

  transform(size: number | null, variableName: string | null): SafeHtml {
    if (size === null) {
      size = 0;
    }

    return this.sanitizer.bypassSecurityTrustStyle(`--${variableName}: -${size}px`);
  }

  constructor(private sanitizer: DomSanitizer) {
  }
}
