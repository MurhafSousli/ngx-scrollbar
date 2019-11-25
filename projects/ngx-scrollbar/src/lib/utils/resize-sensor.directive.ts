import { Directive, Input, Injectable, Inject, AfterContentInit, OnDestroy, NgZone, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { from, of, EMPTY, BehaviorSubject, Observable, Subscription, Observer } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { NgScrollbar } from '../ng-scrollbar';

/**
 * Factory that initialize the ResizeObserver if available in the browser
 * Otherwise, it lazy-loads the ResizeObserver polyfill
 */
@Injectable({ providedIn: 'root' })
export class ResizeObserverFactory {
  private readonly resizeObserverSource = new BehaviorSubject<any>(null);
  readonly resizeObserverLoader = this.resizeObserverSource.asObservable();

  constructor(@Inject(DOCUMENT) document: any, platform: Platform) {
    if (platform.isBrowser) {
      const resizeObserverApi = document.defaultView.ResizeObserver
        ? of(document.defaultView.ResizeObserver)
        : from(import('@juggle/resize-observer')).pipe(
          map((module: { ResizeObserver: any }) => module.ResizeObserver),
          catchError((e) => {
            console.log('Unable to load ResizeObserver polyfill', e);
            return EMPTY;
          }));
      this.resizeObserverSource.next(resizeObserverApi);
    }
  }
}

@Directive({ selector: '[resizeSensor]' })
export class ResizeSensor implements AfterContentInit, OnDestroy {

  /** Debounce interval for emitting the changes. */
  @Input('sensorDebounce')
  get debounce(): number {
    return this._debounce;
  }

  set debounce(value: number) {
    this._debounce = coerceNumberProperty(value);
    this._subscribe();
  }

  private _debounce: number;

  /** Whether ResizeObserver is disabled. */
  @Input('sensorDisabled')
  get disabled() {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this._unsubscribe() : this._subscribe();
  }

  private _disabled: boolean = false;

  private _subscription: Subscription | null = null;
  private _resizeObserver: any;

  @Output() resizeSensor = new EventEmitter<void>();

  constructor(private zone: NgZone,
              private platform: Platform,
              private resizeObserverFactory: ResizeObserverFactory,
              private scrollbar: NgScrollbar) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Resize Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    if (!this._subscription && !this._disabled) {
      this._subscribe();
    }
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

  private _createObserver(ResizeObserver: any): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this._resizeObserver = new ResizeObserver(() => observer.next());
      this._resizeObserver.observe(this.scrollbar.viewport.nativeElement);
      if (this.scrollbar.viewport.contentWrapperElement) {
        this._resizeObserver.observe(this.scrollbar.viewport.contentWrapperElement);
      }
    });
  }

  private _subscribe() {
    this._unsubscribe();
    if (this.platform.isBrowser) {
      this.zone.runOutsideAngular(() => {
        this._subscription = this.resizeObserverFactory.resizeObserverLoader.pipe(
          switchMap((moduleObservable: Observable<any>) => moduleObservable),
          switchMap((ResizeObserver: any) => {
            if (ResizeObserver) {
              const stream = this._createObserver(ResizeObserver);
              return this.debounce ? stream.pipe(debounceTime(this._debounce)) : stream;
            } else {
              return EMPTY;
            }
          })
        ).subscribe(() => this.resizeSensor.emit());
      });
    }
  }

  private _unsubscribe() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
