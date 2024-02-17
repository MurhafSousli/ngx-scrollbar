import { Directive, ElementRef, inject, } from '@angular/core';
import { ViewportAdapter } from './viewport-adapter';

@Directive({
  standalone: true,
  selector: '[scrollViewport]'
})
export class ScrollViewport {

  readonly viewport: ViewportAdapter = new ViewportAdapter(inject(ElementRef<HTMLElement>).nativeElement);

}
