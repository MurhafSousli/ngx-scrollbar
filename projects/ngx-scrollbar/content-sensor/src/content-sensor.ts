import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone, Input, Self, Host } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { Observable, Observer, Subscription } from 'rxjs';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { ScrollbarManager, NgScrollbar } from 'ngx-scrollbar';

@Directive({
  selector: '[content-sensor], [contentSensor]'
})
export class ContentSensor implements AfterContentInit, OnDestroy {

  private contentObserver: MutationObserver | any;
  private subscription = Subscription.EMPTY;

  @Input() sensorDebounce: number = this.manager.globalOptions.contentObserverDebounce;

  constructor(private zone: NgZone,
              private platform: Platform,
              private manager: ScrollbarManager,
              @Host() @Self() @Optional() private scrollbar: NgScrollbar) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Content Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    if (this.platform.isBrowser) {
      this.zone.runOutsideAngular(() => {
        this.subscription = this.observer().pipe(
          tap(() => this.scrollbar.update()),
          finalize(() => this.contentObserver.disconnect())
        ).subscribe();
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private observer(): Observable<void> {
    return this.sensorDebounce ? this.observeContent().pipe(debounceTime(this.sensorDebounce)) : this.observeContent();
  }

  private observeContent(): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.contentObserver = new MutationObserver(() => observer.next());
      this.contentObserver.observe(this.scrollbar.viewport, {
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
