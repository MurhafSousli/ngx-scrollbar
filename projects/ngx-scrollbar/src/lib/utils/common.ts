import { MonoTypeOperatorFunction, Observable, tap, throttleTime } from 'rxjs';

let savedRanges: Range[] = [];

export function saveSelection(doc: Document): void {
  const selection: Selection = doc.getSelection();
  savedRanges = [];
  if (!selection?.rangeCount) return;
  for (let i: number = 0; i < selection.rangeCount; i++) {
    savedRanges.push(selection.getRangeAt(i).cloneRange());
  }
}

export function restoreSelection(doc: Document): void {
  if (!savedRanges?.length) return;
  const selection: Selection = doc.getSelection();
  selection.removeAllRanges();
  savedRanges.forEach(range => selection.addRange(range));
  savedRanges = [];
}

export function preventSelection(doc: Document): MonoTypeOperatorFunction<PointerEvent> {
  // Have to prevent default to avoid unexpected movement whe you grab object beneath scrollbar #476
  // https://github.com/MurhafSousli/ngx-scrollbar/issues/476
  return tap(() => {
    saveSelection(doc);
    doc.getSelection()?.removeAllRanges();
    doc.onselectstart = () => false;
  });
}

export function enableSelection(doc: Document): MonoTypeOperatorFunction<PointerEvent> {
  return tap(() => {
    restoreSelection(doc);
    doc.onselectstart = null;
  });
}

export function stopPropagation(): MonoTypeOperatorFunction<PointerEvent> {
  return tap((e: PointerEvent) => e.stopPropagation());
}

export function getThrottledStream<T>(stream: Observable<T>, duration: number): Observable<T> {
  return !duration ? stream : stream.pipe(
    throttleTime(duration, null, {
      leading: false,
      trailing: true
    })
  );
}

export interface ElementDimension {
  width?: number;
  height?: number;
}

export type ScrollbarDragging = 'x' | 'y' | 'none';

export enum ViewportClasses {
  Viewport = 'ng-scroll-viewport',
  Content = 'ng-scroll-content',
  Spacer = 'ng-scroll-spacer'
}

export type ScrollTimelineFunc = ({ source, axis }: { source: HTMLElement, axis: 'x' | 'y' }) => void;
