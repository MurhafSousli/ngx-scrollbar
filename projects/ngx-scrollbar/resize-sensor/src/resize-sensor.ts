import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone, Input, Self, Host } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { Observable, Observer, Subscription } from 'rxjs';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import ResizeObserver from 'resize-observer-polyfill';
import { ScrollbarManager, NgScrollbar } from 'ngx-scrollbar';

@Directive({
  selector: '[resize-sensor], [resizeSensor]'
})
export class ResizeSensor implements AfterContentInit, OnDestroy {

  private resizeObserver: ResizeObserver;
  private subscription = Subscription.EMPTY;

  @Input() sensorDebounce: number = this.manager.globalOptions.resizeObserverDebounce;

  constructor(private zone: NgZone,
              private platform: Platform,
              private manager: ScrollbarManager,
              @Host() @Self() @Optional() private scrollbar: NgScrollbar) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Resize Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    if (this.platform.isBrowser) {
      if (this.scrollbar.contentWrapper) {
        this.zone.runOutsideAngular(() => {
          this.subscription = this.observer().pipe(
            tap(() => this.scrollbar.update()),
            finalize(() => this.resizeObserver.disconnect())
          ).subscribe();
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.subscription.unsubscribe();
  }

  private observer(): Observable<void> {
    return this.sensorDebounce ? this.observeResize().pipe(debounceTime(this.sensorDebounce)) : this.observeResize();
  }

  private observeResize(): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.resizeObserver = new ResizeObserver(() => observer.next());
      this.resizeObserver.observe(this.scrollbar.viewport);
      this.resizeObserver.observe(this.scrollbar.contentWrapper);
    });
  }
}

@NgModule({
  imports: [PlatformModule],
  declarations: [ResizeSensor],
  exports: [ResizeSensor]
})
export class NgScrollbarResizeSensorModule {
}
