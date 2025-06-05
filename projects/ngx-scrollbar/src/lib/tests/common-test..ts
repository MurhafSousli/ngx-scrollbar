import { NgScrollbar } from 'ngx-scrollbar';

export interface TestDimension {
  cmpWidth?: number,
  cmpHeight?: number,
  contentWidth?: number,
  contentHeight?: number
}

export async function afterTimeout(timeout: number): Promise<void> {
  // Use 'await' with a setTimeout promise
  await new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

export function setDimensions(comp: NgScrollbar, d: TestDimension): void {
  comp.nativeElement.style.width = `${ d.cmpWidth }px`;
  comp.nativeElement.style.height = `${ d.cmpHeight }px`;
  // Get a reference to the inner element to be replaced
  const innerElement: HTMLElement = comp.adapter.contentWrapperElement.querySelector('.inner-element');

  if (innerElement) {
    // Replace the element with the new element
    innerElement.style.width = `${ d.contentWidth }px`;
    innerElement.style.height = `${ d.contentHeight }px`;
  } else {
    // Create a new div element
    const newElement: HTMLElement = document.createElement('div');
    newElement.classList.add('inner-element');
    // Set its style attributes
    newElement.style.width = `${ d.contentWidth }px`;
    newElement.style.height = `${ d.contentHeight }px`;
    // Append the element div to the existing element
    comp.adapter.contentWrapperElement.appendChild(newElement);
  }
}
