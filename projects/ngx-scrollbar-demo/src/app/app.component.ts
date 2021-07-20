import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { BehaviorSubject, Observable } from 'rxjs';
import { auditTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
