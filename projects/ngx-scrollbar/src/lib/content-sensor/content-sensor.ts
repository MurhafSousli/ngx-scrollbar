import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone, Input, Inject } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { Observable, Observer, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';
import { NG_SCROLLBAR_DEFAULT_OPTIONS, NgScrollbarDefaultOptions } from '../scrollbar/ng-scrollbar-config';

@Directive({
  selector: '[content-sensor], [contentSensor]'
})
export class ContentSensor implements AfterContentInit, OnDestroy {

  private subscription = Subscription.EMPTY;

  @Input() sensorDebounce: number = this.defaultOptions.contentObserverDebounce;

  constructor(private ngZone: NgZone,
              private platform: Platform,
              @Optional() private scrollbar: NgScrollbar,
              @Inject(NG_SCROLLBAR_DEFAULT_OPTIONS) private defaultOptions: NgScrollbarDefaultOptions) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Content Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.platform.isBrowser) {
        this.subscription = this.observer().pipe(
          tap(() => this.scrollbar.update())
        ).subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private observer(): Observable<any> {
    return this.sensorDebounce ? this.observeContent().pipe(debounceTime(this.sensorDebounce)) : this.observeContent();
  }

  private observeContent(): Observable<any> {
    let contentObserver: MutationObserver | any;
    return new Observable((observer: Observer<any>) => {
      contentObserver = new MutationObserver((e: any) => observer.next(e));
      contentObserver.observe(this.scrollbar.view, {
        characterData: true,
        childList: true,
        subtree: true
      });
    });
  }
}

@NgModule({
  imports: [PlatformModule],
  declarations: [ContentSensor],
  exports: [ContentSensor]
})
export class NgScrollbarContentSensorModule {
}
