import { NgScrollbar } from 'ngx-scrollbar';

export interface TestDimension {
  cmpWidth?: number,
  cmpHeight?: number,
  contentWidth?: number,
  contentHeight?: number
}

export function setDimensions(comp: NgScrollbar, d: TestDimension): void {
  comp.nativeElement.style.width = `${ d.cmpWidth }px`;
  comp.nativeElement.style.height = `${ d.cmpHeight }px`;
  comp.viewport.contentWrapperElement.innerHTML = `<div style="width: ${ d.contentWidth }px; height: ${ d.contentHeight }px"></div>`;
}
