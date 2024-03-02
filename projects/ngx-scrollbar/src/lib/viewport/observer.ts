import { Observable, Observer, throttleTime } from 'rxjs';
import { ScrollbarUpdateReason } from '../ng-scrollbar.model';

interface ResizeArgs {
  element: HTMLElement;
  throttleDuration: number;
  contentWrapper?: HTMLElement;
}

export function resizeObserver({ element, contentWrapper, throttleDuration }: ResizeArgs): Observable<ScrollbarUpdateReason> {
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
    if (contentWrapper) {
      resizeObserver.observe(contentWrapper);
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


export function mutationObserver(element: HTMLElement, throttleDuration: number): Observable<void> {
  let mutationObserver: MutationObserver;

  const stream: Observable<void> = new Observable((observer: Observer<void>) => {
    mutationObserver = new MutationObserver(() => {
      observer.next();
    });
    mutationObserver.observe(element, { childList: true, subtree: true });

    return () => {
      mutationObserver?.disconnect();
    };
  });

  return stream.pipe(throttleTime(throttleDuration, null, {
    leading: true,
    trailing: true
  }));
}
