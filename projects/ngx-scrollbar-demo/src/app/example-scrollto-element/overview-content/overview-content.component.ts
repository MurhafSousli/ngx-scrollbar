import {
  Component,
  inject,
  signal,
  effect,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  NgZone,
  WritableSignal,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { AnchorLinkComponent } from '../anchor-link/anchor-link.component';
import { ScrollContent } from '../scroll-content.directive';
import { ScrollAnchor } from '../scroll-anchor.directive';

@Component({
  standalone: true,
  selector: 'overview-content',
  template: `
    <anchor-link [links]="scrollContent.anchorsTree()" [activeLinkId]="activeLinkId()"/>
  `,
  styleUrls: ['./overview-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnchorLinkComponent]
})
export class OverviewContentComponent implements AfterViewInit, OnDestroy {

  private fragmentSub$: Subscription;

  // readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  // private zone: NgZone = inject(NgZone);

  private scrollbar: NgScrollbar = inject(NgScrollbar, { skipSelf: true });

  scrollContent: ScrollContent = inject(ScrollContent, { skipSelf: true });

  activeLinkId: WritableSignal<string> = signal<string>('');

  constructor() {
    // if (this.isBrowser) {
    //   this.zone.runOutsideAngular(() => {
    //     const intersectionObserver: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    //       entries.forEach((entry: IntersectionObserverEntry) => {
    //         if (entry.intersectionRatio > 0) {
    //           this.zone.run(() => {
    //             this.activeLinkId.set(entry.target.id);
    //           });
    //         }
    //       });
    //     }, {
    //       root: this.scrollbar.viewport.nativeElement,
    //       rootMargin: '0px 0px 0px -10%',
    //       threshold: 1.0
    //     });
    //
    //     effect(() => {
    //       this.scrollContent.anchors().forEach((group: ScrollAnchor) => {
    //         intersectionObserver.observe(group.nativeElement);
    //       });
    //     });
    //   });
    // }
  }

  private goToAnchor(id: string): void {
    this.scrollbar.scrollToElement(`#${ id }`, { top: -75, duration: 700 });
  }

  ngAfterViewInit(): void {
    this.fragmentSub$ = this.activatedRoute.fragment.pipe(
      tap((fragment: string) => this.goToAnchor(fragment))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.fragmentSub$?.unsubscribe();
  }
}
