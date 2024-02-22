import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ScrollViewport, ViewportAdapter } from './viewport';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

@Component({
  standalone: true,
  selector: 'ng-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars],
  hostDirectives: [ScrollViewport],
  template: `
    <div #contentWrapper>
      <ng-content/>
      <scrollbars/>
    </div>
  `,
  styleUrls: ['./ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbar }
  ]
})
export class NgScrollbar extends NgScrollbarCore implements OnInit {

  @ViewChild('contentWrapper', { static: true }) contentWrapper: ElementRef<HTMLElement>;

  @ViewChild(Scrollbars, { static: true }) _scrollbars: Scrollbars;

  override ngOnInit(): void {
    this.viewport.init(this.nativeElement, this.contentWrapper.nativeElement);
    super.ngOnInit();
  }
}
