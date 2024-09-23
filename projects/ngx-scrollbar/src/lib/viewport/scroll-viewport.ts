import { Directive, inject, ElementRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[scrollViewport]'
})
export class ScrollViewport {

  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

}
