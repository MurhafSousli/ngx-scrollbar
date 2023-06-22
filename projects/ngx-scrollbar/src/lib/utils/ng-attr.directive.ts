import { Directive, ElementRef, Input } from '@angular/core';
import { NgScrollbarState } from '../ng-scrollbar.model';

@Directive({
  selector: '[ngAttr]',
  standalone: true
})
export class NgAttr {

  constructor(private el: ElementRef) {
  }

  @Input() set ngAttr(attrs: NgScrollbarState) {
    for (const [key, value] of Object.entries(attrs)) {
      (this.el.nativeElement as HTMLElement).setAttribute(key, value);
    }
  }
}
