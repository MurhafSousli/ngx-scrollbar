import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone, Input, Inject } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import ResizeObserver from '@juggle/resize-observer';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';
import { Observable, Observer, Subscription } from 'rxjs';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { NG_SCROLLBAR_DEFAULT_OPTIONS, NgScrollbarDefaultOptions } from '../scrollbar/ng-scrollbar-config';

@Directive({
  selector: '[resize-sensor], [resizeSensor]'
})
export class ResizeSensor implements AfterContentInit, OnDestroy {

  private resizeObserver: ResizeObserver;
  private subscription = Subscription.EMPTY;

  @Input() sensorDebounce: number = this.defaultOptions.resizeObserverDebounce;

  constructor(private ngZone: NgZone,
              private platform: Platform,
              @Optional() private scrollbar: NgScrollbar,
              @Inject(NG_SCROLLBAR_DEFAULT_OPTIONS) private defaultOptions: NgScrollbarDefaultOptions) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Resize Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    if (this.platform.isBrowser) {
      if (this.scrollbar.contentWrapper) {
        this.ngZone.runOutsideAngular(() => {
          this.subscription = this.observer().pipe(
            tap(() => this.scrollbar.update()),
            finalize(() => this.resizeObserver.disconnect())
          ).subscribe();
        });
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private observer(): Observable<void> {
    return this.sensorDebounce ? this.observeResize().pipe(debounceTime(this.sensorDebounce)) : this.observeResize();
  }

  private observeResize(): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.resizeObserver = new ResizeObserver(() => observer.next());
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
