import { Directive, computed, contentChildren, Signal } from '@angular/core';
import { ScrollAnchor } from './scroll-anchor.directive';

@Directive({
  selector: '[scrollContent]'
})
export class ScrollContent {

  anchors: Signal<readonly ScrollAnchor[]> = contentChildren<ScrollAnchor>(ScrollAnchor, { descendants: true });

  anchorsTree: Signal<ScrollAnchor[]> = computed(() => {
    return this.anchors().filter((anchor: ScrollAnchor) => anchor.children.length);
  });

}
