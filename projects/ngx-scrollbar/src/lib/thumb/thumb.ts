import { Directive } from '@angular/core';
import { ThumbAdapter } from './thumb-adapter';

@Directive({
  standalone: true,
  selector: '[scrollbarThumbX]',
  providers: [{ provide: ThumbAdapter, useExisting: ThumbXDirective }]
})
export class ThumbXDirective extends ThumbAdapter {

  get offset(): number {
    return this.clientRect.left;
  }

  get size(): number {
    return this.clientRect.width;
  }

  protected get dragStartOffset(): number {
    return this.offset + this.document.defaultView.scrollX;
  }
}

@Directive({
  standalone: true,
  selector: '[scrollbarThumbY]',
  providers: [{ provide: ThumbAdapter, useExisting: ThumbYDirective }]
})
export class ThumbYDirective extends ThumbAdapter {

  get offset(): number {
    return this.clientRect.top;
  }

  get size(): number {
    return this.clientRect.height;
  }

  protected get dragStartOffset(): number {
    return this.offset + this.document.defaultView.scrollY;
  }
}
