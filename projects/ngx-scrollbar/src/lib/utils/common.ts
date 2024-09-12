import { MonoTypeOperatorFunction, Observable, tap, throttleTime } from 'rxjs';

export function filterResizeEntries(entries: ResizeObserverEntry[], target: Element): DOMRectReadOnly {
  return entries.filter((entry: ResizeObserverEntry) => entry.target === target)[0]?.contentRect;
}

export function preventSelection(doc: Document): MonoTypeOperatorFunction<PointerEvent> {
  return tap(() => doc.onselectstart = () => false);
}

export function enableSelection(doc: Document): MonoTypeOperatorFunction<PointerEvent> {
  return tap(() => doc.onselectstart = null);
}

export function stopPropagation(): MonoTypeOperatorFunction<PointerEvent> {
  return tap((e: PointerEvent) => {
    // Have to prevent default to avoid unexpected movement whe you grab object beneath scrollbar #476
    // https://github.com/MurhafSousli/ngx-scrollbar/issues/476
    e.preventDefault();
    e.stopPropagation()
  });
}

export function getThrottledStream(stream: Observable<DOMRectReadOnly>, duration: number): Observable<DOMRectReadOnly> {
  return duration ? stream.pipe(
    throttleTime(duration, null, {
      leading: true,
      trailing: true
    })
  ) : stream;
}

export interface ElementDimension {
  width?: number;
  height?: number;
}

export type ScrollbarDragging = 'x' | 'y' | 'none';

export enum ViewportClasses {
  Viewport = 'ng-scroll-viewport',
  Content = 'ng-scroll-content'
}

export interface ViewportBoundaries {
  contentHeight: number;
  contentWidth: number;
  offsetHeight: number;
  offsetWidth: number;
}

export type ScrollTimelineFunc = ({ source, axis }: { source: HTMLElement, axis: 'x' | 'y' }) => void;
