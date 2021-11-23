import { tap } from 'rxjs/operators';

export function preventSelection(doc: Document) {
  return tap(() => {
    doc.onselectstart = () => false;
  });
}

export function enableSelection(doc: Document) {
  return tap(() => {
    doc.onselectstart = null;
  });
}

export function stopPropagation() {
  return tap((e: MouseEvent) => e.stopPropagation());
}

/**
 * Check if pointer is within scrollbar bounds
 */
export function isWithinBounds(e: MouseEvent, rect: DOMRect): boolean {
  return (
    e.clientX >= rect.left &&
    e.clientX <= rect.left + rect.width &&
    e.clientY >= rect.top &&
    e.clientY <= rect.top + rect.height
  );
}
