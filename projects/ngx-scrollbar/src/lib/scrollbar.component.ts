import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Renderer2,
  ViewEncapsulation,
  NgZone
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription, fromEvent, of, EMPTY } from 'rxjs';
import {
  delay,
  expand,
  map,
  mergeMap,
  takeUntil,
  takeWhile,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'ng-scrollbar',
  templateUrl: 'scrollbar.component.html',
  styleUrls: ['scrollbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class ScrollbarComponent implements AfterViewInit, OnDestroy {

  private _thumbSizeY = 0;
  private _thumbSizeX = 0;
  private _trackTopMax = 0;
  private _trackLeftMax = 0;
  private _scrollLeftMax = 0;
  private _scrollTopMax = 0;
  private _naturalThumbSizeY = 0;
  private _naturalThumbSizeX = 0;
  private _currXPos = 0;
  private _currYPos = 0;
  private _minThumbSize = 20;
  private _scrollSub$: Subscription;
  private _barXSub$: Subscription;
  private _barYSub$: Subscription;
  private _thumbXSub$: Subscription;
  private _thumbYSub$: Subscription;
  private _observer: MutationObserver;

  barX: HTMLElement;
  barY: HTMLElement;
  thumbX: HTMLElement;
  thumbY: HTMLElement;
  view: HTMLElement;

  @ViewChild('barX') barXRef;
  @ViewChild('barY') barYRef;
  @ViewChild('thumbX') thumbXRef;
  @ViewChild('thumbY') thumbYRef;
  @ViewChild('view') viewRef;

  @Input() autoUpdate = true;
  @Input() autoHide = false;
  @Input() trackX = false;
  @Input() trackY = true;
  @Input() viewClass: string;
  @Input() barClass: string;
  @Input() thumbClass: string;
  @Output() scrollState = new EventEmitter<any>();

  constructor(private zone: NgZone, private renderer: Renderer2, @Inject(DOCUMENT) private document: any) {
  }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      this.barX = this.barXRef.nativeElement;
      this.barY = this.barYRef.nativeElement;
      this.thumbX = this.thumbXRef.nativeElement;
      this.thumbY = this.thumbYRef.nativeElement;
      this.view = this.viewRef.nativeElement;

      this.hideNativeScrollbars();

      /** Initialize scrollbars */
      this.scrollWorker(null);

      this._scrollSub$ = fromEvent(this.view, 'scroll').pipe(tap((e) => this.scrollWorker(e))).subscribe();
      if (this.trackX) {
        this._barXSub$ = fromEvent(this.barX, 'mousedown').pipe(tap((e) => this.barXWorker(e))).subscribe();
        this._thumbXSub$ = this.startThumbXWorker();
      }
      if (this.trackY) {
        this._barYSub$ = fromEvent(this.barY, 'mousedown').pipe(tap((e) => this.barYWorker(e))).subscribe();
        this._thumbYSub$ = this.startThumbYWorker();
      }

      if (this.autoUpdate) {
        /** Observe content changes */
        this._observer = new MutationObserver(() => this.update());
        this._observer.observe(this.view, { subtree: true, childList: true });
      }
    });
  }

  ngOnDestroy() {
    if (this._scrollSub$) {
      this._scrollSub$.unsubscribe();
    }
    if (this.trackX) {
      this._barXSub$.unsubscribe();
      this._thumbXSub$.unsubscribe();
    }
    if (this.trackY) {
      this._barYSub$.unsubscribe();
      this._thumbYSub$.unsubscribe();
    }
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  /**
   * Scroll horizontally
   * @param to
   * @param duration
   */
  scrollXTo(to: number, duration = 200) {

    this.zone.runOutsideAngular(() => {
      of(duration).pipe(
        takeWhile(() => duration > 0),
        expand(d => {
          if (d > 0) {
            const difference = to - this.view.scrollLeft;
            const perTick = difference / d * 10;
            this.renderer.setProperty(this.view, 'scrollLeft', this.view.scrollLeft + perTick);
            return of(d - 10).pipe(delay(10));
          } else {
            duration = d;
            return EMPTY;
          }
        })
      ).subscribe();
    });
  }

  /**
   * Scroll vertically
   * @param to
   * @param duration
   */
  scrollYTo(to: number, duration = 200) {
    this.zone.runOutsideAngular(() => {
      of(duration).pipe(
        takeWhile(() => duration > 0),
        expand(d => {
          if (d > 0) {
            const difference = to - this.view.scrollTop;
            const perTick = difference / d * 10;
            this.renderer.setProperty(this.view, 'scrollTop', this.view.scrollTop + perTick);
            return of(d - 10).pipe(delay(10));
          } else {
            duration = d;
            return EMPTY;
          }
        })
      ).subscribe();
    });
  }

  /**
   * Update thumbnails
   */
  update() {
    this.setThumbXPosition(this._currXPos, this.calculateThumbXSize());
    this.setThumbYPosition(this._currYPos, this.calculateThumbYSize());
  }

  /**
   * Scroll Worker
   * @param e - Mouse Event
   */
  private scrollWorker(e: any) {
    this._thumbSizeX = this.thumbX.clientWidth;
    this._thumbSizeY = this.thumbY.clientHeight;

    this._trackLeftMax = this.barX.clientWidth - this._thumbSizeX;
    this._trackTopMax = this.barY.clientHeight - this._thumbSizeY;

    const thumbXPosition = this.view.scrollLeft * this._trackLeftMax / this._scrollLeftMax;
    const thumbYPosition = this.view.scrollTop * this._trackTopMax / this._scrollTopMax;

    this.setThumbXPosition(thumbXPosition, this.calculateThumbXSize());
    this.setThumbYPosition(thumbYPosition, this.calculateThumbYSize());

    /** Emit scroll state */
    this.scrollState.emit(e);
  }

  /**
   * Horizontal scrollbar click worker
   * @param e - Mouse Event
   */
  private barXWorker(e: any) {
    if (e.target === e.currentTarget) {
      const offset = e.offsetX - this._naturalThumbSizeX * .5;
      const thumbPositionPercentage = offset * 100 / this.barX.clientWidth;
      const scrollLeft = thumbPositionPercentage * this.view.scrollWidth / 100;
      this.renderer.setProperty(this.view, 'scrollLeft', scrollLeft);
    }
  }

  /**
   * Vertical scrollbar click worker
   * @param e - Mouse Event
   */
  private barYWorker(e: any) {
    if (e.target === e.currentTarget) {
      const offset = e.offsetY - this._naturalThumbSizeY * .5;
      const thumbPositionPercentage = offset * 100 / this.barY.clientHeight;
      const scrollTop = thumbPositionPercentage * this.view.scrollHeight / 100;
      this.renderer.setProperty(this.view, 'scrollTop', scrollTop);
    }
  }

  /**
   * Start horizontal thumb worker
   */
  private startThumbXWorker(): Subscription {
    const mousedown$ = fromEvent(this.thumbX, 'mousedown');
    const mouseup$ = fromEvent(this.document, 'mouseup');
    const mousemove$ = fromEvent(this.document, 'mousemove');
    return mousedown$.pipe(
      tap(() => this.document.onselectstart = () => false),
      map((mousedownEvent: any) => mousedownEvent.offsetX),
      mergeMap((mousedownOffsetX: number) => mousemove$.pipe(
        takeUntil(mouseup$.pipe(tap(() => this.document.onselectstart = null))),
        map((mousemoveEvent: any) => mousemoveEvent.clientX),
        tap((mousemoveClientX: number) => {
          const offset = mousemoveClientX - this.barX.getBoundingClientRect().left;
          const scroll = this._scrollLeftMax * (offset - mousedownOffsetX) / this._trackLeftMax;
          this.renderer.setProperty(this.view, 'scrollLeft', scroll);
        })
      ))
    ).subscribe();
  }

  /**
   * Start vertical thumb worker
   */
  private startThumbYWorker(): Subscription {
    const mousedown$ = fromEvent(this.thumbY, 'mousedown');
    const mouseup$ = fromEvent(this.document, 'mouseup');
    const mousemove$ = fromEvent(this.document, 'mousemove');
    return mousedown$.pipe(
      tap(() => this.document.onselectstart = () => false),
      map((mousedownEvent: any) => mousedownEvent.offsetY),
      mergeMap((mousedownOffsetY: number) => mousemove$.pipe(
        takeUntil(mouseup$.pipe(tap(() => this.document.onselectstart = null))),
        map((mousemoveEvent: any) => mousemoveEvent.clientY),
        tap((mousemoveClientY: number) => {
          const offset = mousemoveClientY - this.barY.getBoundingClientRect().top;
          const scroll = this._scrollTopMax * (offset - mousedownOffsetY) / this._trackTopMax;
          this.renderer.setProperty(this.view, 'scrollTop', scroll);
        })
      ))
    ).subscribe();
  }

  /**
   * Calculate Thumb X Size
   */
  private calculateThumbXSize(): number {
    this._naturalThumbSizeX = this.barX.clientWidth / this.view.scrollWidth * this.barX.clientWidth;
    this._scrollLeftMax = this.view.scrollWidth - this.view.clientWidth;
    return this.scrollBoundaries(this._naturalThumbSizeX, this._scrollLeftMax);
  }

  /**
   * Calculate Thumb Y Size
   */
  private calculateThumbYSize(): number {
    this._naturalThumbSizeY = this.barY.clientHeight / this.view.scrollHeight * this.barY.clientHeight;
    this._scrollTopMax = this.view.scrollHeight - this.view.clientHeight;
    return this.scrollBoundaries(this._naturalThumbSizeY, this._scrollTopMax);
  }

  /**
   * Get scrollbar thumb size
   * @param naturalThumbSize
   * @param scrollMax
   */
  private scrollBoundaries(naturalThumbSize: number, scrollMax: number): number {
    return (naturalThumbSize < this._minThumbSize) ? this._minThumbSize : scrollMax ? naturalThumbSize : 0;
  }

  /**
   * Set horizontal scrollbar thumb style
   * @param x
   * @param width
   */
  private setThumbXPosition(x: number, width: number) {
    const transform = `translate3d(${x}px, 0, 0)`;
    this.renderer.setStyle(this.thumbX, 'webkitTransform', transform);
    this.renderer.setStyle(this.thumbX, 'transform', transform);
    this.renderer.setStyle(this.thumbX, 'width', width + 'px');
    this._currXPos = x;
  }

  /**
   * Set vertical scrollbar thumb style
   * @param y
   * @param height
   */
  private setThumbYPosition(y: number, height: number) {
    const transform = `translate3d(0, ${y}px, 0)`;
    this.renderer.setStyle(this.thumbY, 'webkitTransform', transform);
    this.renderer.setStyle(this.thumbY, 'transform', transform);
    this.renderer.setStyle(this.thumbY, 'height', height + 'px');
    this._currYPos = y;
  }

  /**
   * Hide native scrollbars
   */
  private hideNativeScrollbars() {
    const size = `calc(100% + ${this.getNativeScrollbarWidth()}px)`;
    this.renderer.setStyle(this.view, 'width', size);
    this.renderer.setStyle(this.view, 'height', size);
  }

  /**
   * Get the native scrollbar width
   */
  private getNativeScrollbarWidth(): number {
    const element = this.document.createElement('div');
    element.style.position = 'absolute';
    element.style.top = '-9999px';
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.overflow = 'scroll';
    element.style.msOverflowStyle = 'scrollbar';
    this.document.body.appendChild(element);
    const sw = element.offsetWidth - element.clientWidth;
    this.document.body.removeChild(element);
    return sw;
  }
}
