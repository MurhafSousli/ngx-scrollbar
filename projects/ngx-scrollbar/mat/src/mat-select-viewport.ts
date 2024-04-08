import { Directive, effect, inject } from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { _NgScrollbar, NG_SCROLLBAR } from 'ngx-scrollbar';

@Directive({
  standalone: true,
  selector: 'ng-scrollbar[matSelectViewport]'
})
export class NgScrollbarMatSelectViewport {

  private readonly scrollbar: _NgScrollbar = inject(NG_SCROLLBAR);

  private readonly matSelect: MatSelect = inject(MatSelect);

  constructor() {
    effect(() => {
      if (this.scrollbar.isVerticallyScrollable() && this.matSelect.panelOpen) {
        const selected: MatOption | MatOption[] = this.matSelect.selected;
        if (selected) {
          const element: HTMLElement = Array.isArray(selected) ? selected[0]._getHostElement() : selected._getHostElement();
          const height: number = this.scrollbar.nativeElement.clientHeight;
          this.scrollbar.viewport.scrollYTo(element.offsetTop + element.offsetHeight - height);
        }
      }
    });
  }
}
