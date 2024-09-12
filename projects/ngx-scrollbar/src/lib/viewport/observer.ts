import { Observable, Observer, throttleTime } from 'rxjs';

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
