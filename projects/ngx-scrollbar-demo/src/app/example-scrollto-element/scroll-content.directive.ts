import {
  computed, contentChildren, ContentChildren, Directive,
  effect,
  ElementRef,
  inject,
  NgZone,
  PLATFORM_ID,
  QueryList,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollAnchor } from './scroll-anchor.directive';

@Directive({
  standalone: true,
  selector: '[scrollContent]'
})
export class ScrollContent {

  // readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  readonly nativeElement: HTMLElement = inject(ElementRef).nativeElement;

  // private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  // private zone: NgZone = inject(NgZone);

  // private fragmentSub$: Subscription;

  // activeId: WritableSignal<string> = signal('');

  anchors: Signal<readonly ScrollAnchor[]> = contentChildren<ScrollAnchor>(ScrollAnchor, { descendants: true });

  anchorsTree: Signal<ScrollAnchor[]> = computed(() => {
    return this.anchors().filter((anchor: ScrollAnchor) => anchor.children.length);
  });

  // constructor() {
  //   if (this.isBrowser) {
      // this.zone.runOutsideAngular(() => {
      //   const intersectionObserver: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      //     console.log(entries)
      //     entries.forEach((entry: IntersectionObserverEntry) => {
      //       if (entry.intersectionRatio > 0) {
      //         this.zone.run(() => {
      //           this.activeId.set(entry.target.id);
      //         })
      //       }
      //     });
      //   }, {
      //     root: this.nativeElement,
      //     rootMargin: '-10% 0px -50% 0px',
      //   });

      // effect(() => {
      //   this.anchors().forEach((group: Group) => {
      //     console.log(group)
      //     intersectionObserver.observe(group.element);
      //     group.sections.forEach((section: Element) => {
      //       intersectionObserver.observe(section);
      //     });
      //   });
      // });
      // });
    // }
  // }
}
