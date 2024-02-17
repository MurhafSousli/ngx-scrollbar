import { Observable, Observer, throttleTime } from 'rxjs';
import { ScrollbarUpdateReason } from '../ng-scrollbar.model';

export function resizeSensor(element: HTMLElement, throttleDuration: number, isScrollbar?: boolean): Observable<ScrollbarUpdateReason> {
  // The first time the observer is triggered as soon as the element is observed,
  // So we need to differentiate the reason of the event fired
  let reason: ScrollbarUpdateReason = ScrollbarUpdateReason.AfterInit;

  let resizeObserver: ResizeObserver;

  const stream: Observable<ScrollbarUpdateReason> = new Observable((observer: Observer<ScrollbarUpdateReason>) => {
    resizeObserver = new ResizeObserver(() => {
      observer.next(reason);
      // After first init event, mark the reason to be a resize from now on.
      reason = ScrollbarUpdateReason.Resized;
    });
    resizeObserver.observe(element);

    // If a content element has a supporting content scrollbars, observe it!
    if (!isScrollbar && element.firstElementChild) {
      resizeObserver.observe(element.firstElementChild);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  });

  return throttleDuration ? stream.pipe(throttleTime(throttleDuration, null, {
    leading: true,
    trailing: true
  })) : stream;
}
