import {
  Component,
  inject,
  signal,
  AfterViewInit,
  OnDestroy,
  WritableSignal,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { NgScrollbar, ViewportAdapter } from 'ngx-scrollbar';
import { AnchorLinkComponent } from '../anchor-link/anchor-link.component';
import { ScrollContent } from '../scroll-content.directive';

@Component({
  selector: 'overview-content',
  template: `
    <anchor-link [links]="scrollContent.anchorsTree()" [activeLinkId]="activeLinkId()"/>
  `,
  styleUrl: './overview-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnchorLinkComponent]
})
export class OverviewContentComponent implements AfterViewInit, OnDestroy {

  private fragmentSub$: Subscription;

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private scrollbar: ViewportAdapter = inject(ViewportAdapter, { skipSelf: true });

  scrollContent: ScrollContent = inject(ScrollContent, { skipSelf: true });

  activeLinkId: WritableSignal<string> = signal<string>('');

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
