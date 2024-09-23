import { MonoTypeOperatorFunction, Observable, tap, throttleTime } from 'rxjs';

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

export function getThrottledStream<T>(stream: Observable<T>, duration: number): Observable<T> {
  return stream.pipe(
    throttleTime(duration || 0, null, {
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

export interface ViewportBoundaries {
  contentHeight: number;
  contentWidth: number;
  offsetHeight: number;
  offsetWidth: number;
}

export type ScrollTimelineFunc = ({ source, axis }: { source: HTMLElement, axis: 'x' | 'y' }) => void;
