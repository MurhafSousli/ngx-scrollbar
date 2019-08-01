import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'cssVariable'
})
export class CssVariablePipe implements PipeTransform {

  transform(size: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustStyle(`--native-scrollbar-size: -${size}px`);
  }

  constructor(private sanitizer: DomSanitizer) {
  }
}
