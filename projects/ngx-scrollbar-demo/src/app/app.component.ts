import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { BehaviorSubject, Observable, auditTime, map, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './shared/footer/footer.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { ExampleNestedVirtualScrollComponent } from './example-nested-virtual-scroll/example-nested-virtual-scroll.component';
import { ExampleVirtualScrollComponent } from './example-virutal-scroll/example-virtual-scroll.component';
import { ExampleInfiniteScrollComponent } from './example-infinite-scroll/example-infinite-scroll.component';
import { ExampleScrolltoElementComponent } from './example-scrollto-element/example-scrollto-element.component';
import { Example5Component } from './example5/example5.component';
import { Example4Component } from './example4/example4.component';
import { Example3Component } from './example3/example3.component';
import { Example2Component } from './example2/example2.component';
import { ExampleXComponent } from './example-x/example-x.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgScrollbar,
    HeaderComponent,
    FooterComponent,
    SponsorsComponent,
    ExampleXComponent,
    Example2Component,
    Example3Component,
    Example4Component,
    Example5Component,
    ExampleScrolltoElementComponent,
    ExampleInfiniteScrollComponent,
    ExampleVirtualScrollComponent,
    ExampleNestedVirtualScrollComponent
  ]
})
export class AppComponent implements AfterViewInit {

  @ViewChild(NgScrollbar) scrollable: NgScrollbar;

  largeScreen$: Observable<boolean>;

  scrollToIcon$ = new BehaviorSubject<string>('bottom');

  constructor(breakpointObserver: BreakpointObserver) {
    this.largeScreen$ = breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(map((state: BreakpointState) => !state.matches));
  }

  ngAfterViewInit() {
    this.scrollable.verticalScrolled.pipe(
      auditTime(200),
      tap(() => {
        const center = this.scrollable.viewport.clientHeight / 2;
        const scrollHeight = this.scrollable.viewport.scrollHeight;
        const scrollTop = this.scrollable.viewport.scrollTop;
        this.scrollToIcon$.next(scrollTop + center > scrollHeight / 2 ? 'top' : 'bottom');
      })
    ).subscribe();
  }

  scrollToEdge(icon: string) {
    if (icon === 'top') {
      this.scrollable.scrollTo({ top: 0 });
    } else {
      this.scrollable.scrollTo({ bottom: 0 });
    }
  }

}
