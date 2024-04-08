import { Directive, Input, inject, ElementRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[scrollAnchor]',
  host: {
    '[id]': 'id'
  }
})
export class ScrollAnchor {

  readonly nativeElement: HTMLElement = inject(ElementRef).nativeElement;

  readonly parent: ScrollAnchor = inject(ScrollAnchor, { skipSelf: true, optional: true });

  readonly children: ScrollAnchor[] = [];

  @Input() id: string;

  @Input() linkText: string;

  constructor() {
    if (this.parent) {
      this.parent.children.push(this);
    }
  }
}
