import { Directive, effect } from '@angular/core';
import { RtlScrollAxisType } from '@angular/cdk/platform';
import { ThumbAdapter } from './thumb-adapter';

@Directive({
  standalone: true,
  selector: '[scrollbarThumbX]',
  providers: [{ provide: ThumbAdapter, useExisting: ThumbXDirective }]
})
export class ThumbXDirective extends ThumbAdapter {

  protected get clientProperty(): string {
    return 'clientX';
  }

  protected get pageProperty(): string {
    return 'pageX';
  }

  get viewportScrollMax(): number {
    return this.cmp.viewport.scrollMaxX;
  }

  get dragStartOffset(): number {
    return this.clientRect.left + this.document.defaultView.pageXOffset;
  }

  get offset(): number {
    return this.clientRect.left;
  }

  get size(): number {
    return this.nativeElement.clientWidth;
  }

  protected axis: 'x' | 'y' = 'x';

  protected handleDrag: (position: number, scrollMax: number) => number;

  constructor() {
    super();
    effect(() => {
      if (this.cmp.direction() === 'rtl') {
        if (this.manager.rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
          this.handleDrag = (position: number, scrollMax: number): number => -(scrollMax - position);
        }
        if (this.manager.rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
          this.handleDrag = (position: number, scrollMax: number): number => position - scrollMax;
        }
      } else {
        this.handleDrag = (position: number): number => position;
      }
    });
  }

  protected scrollTo(position: number): void {
    this.cmp.viewport.scrollXTo(position);
  }
}

@Directive({
  standalone: true,
  selector: '[scrollbarThumbY]',
  providers: [{ provide: ThumbAdapter, useExisting: ThumbYDirective }]
})
export class ThumbYDirective extends ThumbAdapter {

  protected get pageProperty(): string {
    return 'pageY';
  }

  get viewportScrollMax(): number {
    return this.cmp.viewport.scrollMaxY;
  }

  protected get clientProperty(): string {
    return 'clientY';
  }

  get dragStartOffset(): number {
    return this.clientRect.top + this.document.defaultView.pageYOffset;
  }

  get offset(): number {
    return this.clientRect.top;
  }

  get size(): number {
    return this.nativeElement.clientHeight;
  }

  protected axis: 'x' | 'y' = 'y';

  protected handleDrag = (position: number): number => position;

  protected scrollTo(position: number): void {
    this.cmp.viewport.scrollYTo(position);
  }
}
