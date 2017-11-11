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
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import { ScrollBarState, ScrollBarEvent } from './scrollbar.model';

@Component({
  selector: 'ng-scrollbar',
  templateUrl: 'scrollbar.component.html',
  styleUrls: ['scrollbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ScrollbarComponent implements AfterViewInit, OnDestroy {

  private SCROLLBAR_WIDTH = this.getScrollbarWidth();

  private _thumbSizeY: number;
  private _thumbSizeX: number;
  private _trackTopMax: number;
  private _trackLeftMax: number;
  private _scrollLeftMax: number;
  private _scrollTopMax: number;
  private _naturalThumbSizeY: number;
  private _naturalThumbSizeX: number;
  private _prevPageY = 0;
  private _prevPageX = 0;

  private minThumbSize = 20;
  private observer: MutationObserver;

  barX: HTMLElement;
  barY: HTMLElement;
  thumbX: HTMLElement;
  thumbY: HTMLElement;
  view: HTMLElement;

  scrollWorker$ = new Subject();
  barWorker$ = new Subject();
  thumbWorker$ = new Subject();
  state$ = new BehaviorSubject<ScrollBarState>({});

  @ViewChild('barX') barXRef: ElementRef;
  @ViewChild('barY') barYRef: ElementRef;
  @ViewChild('thumbX') thumbXRef: ElementRef;
  @ViewChild('thumbY') thumbYRef: ElementRef;
  @ViewChild('view') viewRef: ElementRef;

  @Input() autoHide = false;
  @Input() trackX = false;
  @Input() trackY = true;
  @Output() scrollState = new EventEmitter<MouseEvent>();

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: any) {
  }

  ngAfterViewInit() {
    this.barX = this.barXRef.nativeElement;
    this.barY = this.barYRef.nativeElement;
    this.thumbX = this.thumbXRef.nativeElement;
    this.thumbY = this.thumbYRef.nativeElement;
    this.view = this.viewRef.nativeElement;

    this.scrollWorker().subscribe();
    this.thumbWorker().subscribe();
    this.barWorker().subscribe();

    /** Initialize custom scrollbars */
    Observable.of({}).take(1).subscribe(() => {
      this.setState({
        thumbXStyle: this.scrollbarXStyle(0, this.calculateThumbXSize()),
        thumbYStyle: this.scrollbarYStyle(0, this.calculateThumbYSize()),
        viewStyle: this.viewStyle(this.SCROLLBAR_WIDTH)
      });
    });

    /** Observe content changes */
    this.observer = new MutationObserver(() => this.onContentChanged());

    const config: MutationObserverInit = {
      subtree: true,
      childList: true
    };

    this.observer.observe(this.view, config);
  }

  ngOnDestroy() {
    this.scrollWorker$.unsubscribe();
    this.thumbWorker$.unsubscribe();
    this.barWorker$.unsubscribe();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Update when content changes
   */
  onContentChanged() {
    Observable.of({}).take(1).subscribe(() => {
      this.setState({
        thumbXStyle: this.scrollbarXStyle(0, this.calculateThumbXSize()),
        thumbYStyle: this.scrollbarYStyle(0, this.calculateThumbYSize()),
        viewStyle: this.viewStyle(this.SCROLLBAR_WIDTH)
      });
    });
  }

  /**
   * Set scrolling state
   * @param state
   */
  setState(state: ScrollBarState) {
    this.state$.next({...this.state$.getValue(), ...state});
  }

  /**
   *  Worker for scrolling
   * @return Observable<any>
   */
  private scrollWorker(): Observable<any> {
    return this.scrollWorker$.switchMap((event: MouseEvent) => {

      return Observable.of(event).do(() => {

        this._thumbSizeX = this.thumbX.clientWidth;
        this._thumbSizeY = this.thumbY.clientHeight;

        this._trackLeftMax = this.barX.clientWidth - this._thumbSizeX;
        this._trackTopMax = this.barY.clientHeight - this._thumbSizeY;

        const thumbXPosition = this.view.scrollLeft * this._trackLeftMax / this._scrollLeftMax;
        const thumbYPosition = this.view.scrollTop * this._trackTopMax / this._scrollTopMax;

        this.setState({
          thumbXStyle: this.scrollbarXStyle(thumbXPosition, this.calculateThumbXSize()),
          thumbYStyle: this.scrollbarYStyle(thumbYPosition, this.calculateThumbYSize()),
          viewStyle: this.viewStyle(this.SCROLLBAR_WIDTH)
        });

        /** Emit scroll state */
        this.scrollState.emit(event);
      });
    });
  }

  /**
   * Worker for dragging scrollbar thumbs
   * @return Observable<any>
   */
  private thumbWorker(): Observable<any> {
    return this.thumbWorker$.switchMap((event: ScrollBarEvent) => {
        return Observable.of(event).do((scrollEvent: ScrollBarEvent) => {

          /** Disable selection while dragging scrollbars */
          const selectStartListener = this.renderer.listen(this.document, 'selectstart', () => false);

          /** Start dragging scrollbar on mouseMove */
          const startDrag = (e: MouseEvent) => {

            if (scrollEvent.axis === 'y' && this._prevPageY) {

              const offset = e.clientY - this.barY.getBoundingClientRect().top;
              const thumbClickPosition = this._thumbSizeY - this._prevPageY;
              const scrollTop = this._scrollTopMax * (offset - thumbClickPosition) / this._trackTopMax;
              this.setState({scrollTop});

            } else if (scrollEvent.axis === 'x' && this._prevPageX) {

              const offset = e.clientX - this.barX.getBoundingClientRect().left;
              const thumbClickPosition = this._thumbSizeX - this._prevPageX;
              const scrollLeft = this._scrollLeftMax * (offset - thumbClickPosition) / this._trackLeftMax;
              this.setState({scrollLeft});
            }
          };

          /** Reset and remove listeners on mouseUp */
          const endDrag = () => {
            selectStartListener();
            mouseMoveEvent();
            mouseUpListener();
            this._prevPageY = this._prevPageX = 0;
          };

          const mouseMoveEvent = this.renderer.listen(this.document.body, 'mousemove', startDrag);
          const mouseUpListener = this.renderer.listen(this.document.body, 'mouseup', endDrag);

          this._prevPageY = this._thumbSizeY - scrollEvent.e.offsetY;
          this._prevPageX = this._thumbSizeX - scrollEvent.e.offsetX;
        });
      }
    );
  }

  /**
   * Worker for scrolling on scrollbar click (not the thumb)
   * @return Observable<any>
   */
  private barWorker(): Observable<any> {
    return this.barWorker$.switchMap((event: ScrollBarEvent) => {
      return Observable.of(event).do((scrollEvent: ScrollBarEvent) => {
        if (scrollEvent.e.target !== scrollEvent.e.currentTarget) {
          return;
        }
        if (scrollEvent.axis === 'y') {
          const offset = scrollEvent.e.offsetY - this._naturalThumbSizeY * .5;
          const thumbPositionPercentage = offset * 100 / this.barY.clientHeight;
          const scrollTop = thumbPositionPercentage * this.view.scrollHeight / 100;
          this.setState({scrollTop});
        } else {
          const offset = scrollEvent.e.offsetX - this._naturalThumbSizeX * .5;
          const thumbPositionPercentage = offset * 100 / this.barX.clientWidth;
          const scrollLeft = thumbPositionPercentage * this.view.scrollWidth / 100;
          this.setState({scrollLeft});
        }
      });
    });
  }

  /**
   * Calculate Thumb X Size
   * @return number
   */
  private calculateThumbXSize(): number {
    this._naturalThumbSizeX = this.barX.clientWidth / this.view.scrollWidth * this.barX.clientWidth;
    this._scrollLeftMax = this.view.scrollWidth - this.view.clientWidth;
    return this.scrollBoundaries(this._naturalThumbSizeX, this._scrollLeftMax);
  }

  /**
   * Calculate Thumb Y Size
   * @return number
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
   * @return number
   */
  private scrollBoundaries(naturalThumbSize: number, scrollMax: number): number {
    if (naturalThumbSize < this.minThumbSize) {
      return this.minThumbSize;
    } else if (scrollMax) {
      return naturalThumbSize;
    } else {
      return 0;
    }
  }

  /**
   * Set horizontal scrollbar thumb style
   * @param x
   * @param width
   * @return any
   */
  private scrollbarXStyle(x: number, width: number): any {
    return {
      width: width + 'px',
      msTransform: `translateX(${x}, 0)`,
      webkitTransform: `translate3d(${x}px, 0, 0)`,
      transform: `translate3d(${x}px, 0, 0)`
    };
  }

  /**
   * Set vertical scrollbar thumb style
   * @param y
   * @param height
   * @return any
   */
  private scrollbarYStyle(y: number, height: number): any {
    return {
      height: height + 'px',
      msTransform: `translateY(0,${y})`,
      webkitTransform: `translate3d(0, ${y}px, 0)`,
      transform: `translate3d(0, ${y}px, 0)`
    };
  }

  /**
   * Hide original scrollbars
   * @param size
   * @return any
   */
  private viewStyle(size: number): any {
    return {
      width: `calc(100% + ${size}px)`,
      height: `calc(100% + ${size}px)`
    };
  }

  /**
   * Get the original scrollbar width to hide them
   * @return number
   */
  private getScrollbarWidth(): number {
    const e = this.renderer.createElement('div');
    e.style.position = 'absolute';
    e.style.top = '-9999px';
    e.style.width = '100px';
    e.style.height = '100px';
    e.style.overflow = 'scroll';
    e.style.msOverflowStyle = 'scrollbar';
    this.renderer.appendChild(this.document.body, e);
    const sw = (e.offsetWidth - e.clientWidth);
    this.renderer.removeChild(this.document.body, e);
    return sw;
  }
}
