import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone, Input } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { Observable, Observer, Subscription } from 'rxjs';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import ResizeObserver from '@juggle/resize-observer';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';
import { ScrollbarManager } from '../scrollbar/utils/scrollbar-manager';

@Directive({
  selector: '[resize-sensor], [resizeSensor]'
})
export class ResizeSensor implements AfterContentInit, OnDestroy {

  private resizeObserver: ResizeObserver;
  private subscription = Subscription.EMPTY;

  @Input() sensorDebounce: number = this.manager.globalOptions.resizeObserverDebounce;

  constructor(private ngZone: NgZone,
              private platform: Platform,
              private manager: ScrollbarManager,
              @Optional() private scrollbar: NgScrollbar) {
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
