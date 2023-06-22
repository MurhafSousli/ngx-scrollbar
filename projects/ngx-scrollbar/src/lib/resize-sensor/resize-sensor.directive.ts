import { Directive, Input, Output, EventEmitter, AfterContentInit, OnDestroy, NgZone } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Observable, Subscription, Observer, debounceTime } from 'rxjs';
import { NgScrollbarBase } from '../ng-scrollbar-base';

/*
 * Source code: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/resize-observer-browser
 * The package was not included from npm because its usage is /// <reference types="resize-observer-browser"/>
 * And that usage was causing an interface conflicts with some libraries
 */
interface ResizeObserverOptions {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), and `border-box`.
   */
  box?: 'content-box' | 'border-box';
}

interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void;

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

@Directive({
    selector: '[resizeSensor]',
    standalone: true
})
export class ResizeSensor implements AfterContentInit, OnDestroy {

  /** Debounce interval for emitting the changes. */
  @Input('sensorDebounce')
  get debounce(): number | undefined {
    return this._debounce;
  }

  set debounce(value: number | undefined) {
    this._debounce = coerceNumberProperty(value);
    this._subscribe();
  }

  private _debounce: number | undefined;

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

  private _currentSubscription: Subscription | null = null;
  private _resizeObserver!: ResizeObserver;

  @Output('resizeSensor') event = new EventEmitter<ReadonlyArray<ResizeObserverEntry>>();

  constructor(private zone: NgZone,
              private platform: Platform,
              private scrollbar: NgScrollbarBase) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Resize Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    if (!this._currentSubscription && !this._disabled) {
      this._subscribe();
    }
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

  private _subscribe() {
    this._unsubscribe();

    if (this.platform.isBrowser) {

      const stream = new Observable((observer: Observer<ReadonlyArray<ResizeObserverEntry>>) => {
        this._resizeObserver = new ResizeObserver((e: ReadonlyArray<ResizeObserverEntry>) => observer.next(e));
        this._resizeObserver.observe(this.scrollbar.viewport.nativeElement);
        if (this.scrollbar.viewport.contentWrapperElement) {
          this._resizeObserver.observe(this.scrollbar.viewport.contentWrapperElement);
        }
      });

      this.zone.runOutsideAngular(() => {
        this._currentSubscription = (this._debounce ? stream.pipe(debounceTime(this._debounce)) : stream).subscribe(this.event);
      });
    }
  }

  private _unsubscribe() {
    this._resizeObserver?.disconnect();
    this._currentSubscription?.unsubscribe();
  }
}
