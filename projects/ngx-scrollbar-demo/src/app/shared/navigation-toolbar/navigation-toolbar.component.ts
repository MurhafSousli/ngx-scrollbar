import { AfterViewChecked, Component, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
// import { NgScrollbar } from 'ngx-scrollbar';
import { NgScrollbar } from '../../../../../ngx-scrollbar/src/public-api';

@Component({
  selector: 'app-navigation-toolbar',
  templateUrl: './navigation-toolbar.component.html',
  styleUrls: ['./navigation-toolbar.component.scss'],
})
export class NavigationToolbarComponent implements AfterViewChecked, OnDestroy {

  // Main scroll event subscription
  private mainScrolledSubscription = Subscription.EMPTY;

  // Stream that emits when navigation items changes
  private state = new BehaviorSubject<NavigationButtons[]>(examplesData);

  // Main scrollbar scroll event
  private mainScrolled: Observable<any>;

  // Main scrollbar reference
  @Input('scrollable') mainScrollbar: NgScrollbar;

  // Navigation buttons scrollbar
  @ViewChild(NgScrollbar, { static: true }) navScrollbar: NgScrollbar;

  // Navigation items observable
  examples: Observable<NavigationButtons[]> = this.state.pipe(
    distinctUntilChanged()
  );

  constructor(private zone: NgZone) {
  }

  ngAfterViewChecked() {
    // Check if the main scrollbar event is ready
    if (!this.mainScrolled && this.mainScrollbar.verticalScrolled) {
      // Get vertical scroll event
      this.mainScrolled = this.mainScrollbar.verticalScrolled;
      this.mainScrolledSubscription = this.mainScrolled.pipe(
        debounceTime(100),
        map((e: any) => {
          const fromTop = e.target.scrollTop + 200;
          return this.state.value.map((example: NavigationButtons) => {
            const section: HTMLElement = document.querySelector(example.selector);
            if (section && section.firstChild) {
              const firstChild: HTMLElement = section.firstChild as HTMLElement;
              return {
                ...example,
                active: firstChild.offsetTop - 56 <= fromTop && firstChild.offsetTop + firstChild.offsetHeight + 56 > fromTop
              };
            }
            return undefined;
          });
        }),
        tap((examples: NavigationButtons[]) => {
          // Check if there is any item activated
          console.log(examples);
          const shouldScrollToElement = !!examples.filter((example) => example.active).length;
          if (shouldScrollToElement) {
            this.zone.run(() => this.state.next(examples));
            // this.navScrollbar.scrollToSelector('.mat-tab-label-active', 0, 200);
          } else {
            // this.navScrollbar.scrollToLeft(200);
          }
        })
      ).subscribe();
    }
  }

  ngOnDestroy() {
    this.mainScrolledSubscription.unsubscribe();
  }
}

interface NavigationButtons {
  label?: string;
  selector?: string;
  top?: number;
  duration?: number;
  active?: boolean;
}

const examplesData: NavigationButtons[] = [
  {
    label: 'Lab',
    selector: 'app-example-x',
    top: 200,
    duration: 600
  },
  {
    label: 'Ex 1',
    selector: 'app-example2',
    top: 200,
    duration: 600
  },
  {
    label: 'Ex 2',
    selector: 'app-example3',
    top: 200,
    duration: 600
  },
  {
    label: 'Ex 3',
    selector: 'app-example4',
    top: 200,
    duration: 600
  },
  {
    label: 'Ex 4',
    selector: 'app-example5',
    top: 200,
    duration: 800
  },
  {
    label: 'Infinite Scroll',
    selector: 'app-example-infinite-scroll',
    top: 200,
    duration: 800
  },
  {
    label: 'Virtual Scroll',
    selector: 'app-example-virtual-scroll',
    top: 200,
    duration: 800
  },
  {
    label: 'Nested Virtual Scroll',
    selector: 'app-example-nested-virtual-scroll',
    top: 100,
    duration: 800
  }
];
