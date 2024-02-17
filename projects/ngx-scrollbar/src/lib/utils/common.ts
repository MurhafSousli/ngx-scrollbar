import { MonoTypeOperatorFunction, tap } from 'rxjs';

export function preventSelection(doc: Document): MonoTypeOperatorFunction<any> {
  return tap(() => doc.onselectstart = () => false);
}

export function enableSelection(doc: Document): MonoTypeOperatorFunction<any> {
  return tap(() => doc.onselectstart = null);
}

export function stopPropagation(): MonoTypeOperatorFunction<any> {
  return tap((e: MouseEvent) => {
    // Have to prevent default to avoid unexpected movement whe you grab object beneath scrollbar #476
    // https://github.com/MurhafSousli/ngx-scrollbar/issues/476
    e.preventDefault();
    e.stopPropagation()
  });
}
