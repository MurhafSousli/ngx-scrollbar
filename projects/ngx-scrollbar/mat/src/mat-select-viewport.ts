import { Directive, effect, inject, untracked } from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { ViewportAdapter } from 'ngx-scrollbar';

@Directive({
  selector: 'ng-scrollbar[matSelectViewport]'
})
export class NgScrollbarMatSelectViewport {

  private readonly adapter: ViewportAdapter = inject(ViewportAdapter);

  private readonly matSelect: MatSelect = inject(MatSelect);

  constructor() {
    // The scroll position be set before the panel is rendered; that's why we use effect over afterRenderEffect.
    effect(() => {
      const isVerticallyScrollable: boolean = this.adapter.isVerticallyScrollable();

      untracked(() => {
        if (isVerticallyScrollable && this.matSelect.panelOpen) {
          const selected: MatOption | MatOption[] = this.matSelect.selected;
          if (selected) {
            const element: HTMLElement = Array.isArray(selected) ? selected[0]._getHostElement() : selected._getHostElement();
            const height: number = this.adapter.viewportElement.clientHeight;
            this.adapter.scrollYTo(element.offsetTop + element.offsetHeight - height);
          }
        }
      });
    });
  }
}
