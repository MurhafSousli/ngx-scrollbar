import { ChangeDetectionStrategy, ViewChild, Component, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'app-example-x',
  templateUrl: './example-x.component.html',
  styleUrls: ['./example-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleXComponent {
  compact = false;
  invert = false;
  more = false;
  cssVariables: SafeStyle;
  @ViewChild(NgScrollbar, {read: ElementRef}) private _scrollable: ElementRef;

  constructor(private _sanitizer: DomSanitizer) {
  }

  setStyle(variables: Partial<NgScrollbarCssVariables>) {
    this.cssVariables = this._sanitizer.bypassSecurityTrustStyle(new CssVariables(variables).value);
  }

}

export interface NgScrollbarCssVariables {
  color: string;
  viewColor: string;
  thumbColor: string;
  thumbHoverColor: string;
  containerColor: string;
  size: string;
  viewMargin: string;
  padding: string;
  borderRadius: string;
}

class CssVariables {
  private readonly _keyValues = {
    color: '--scrollbar-color',
    viewColor: '--scroll-view-color',
    thumbColor: '--scrollbar-thumb-color',
    thumbHoverColor: '--scrollbar-thumb-hover-color',
    containerColor: '--scrollbar-container-color',
    size: '--scrollbar-size',
    padding: '--scrollbar-padding',
    viewMargin: '--scroll-view-margin',
    borderRadius: '--scrollbar-border-radius'
  };

  constructor(private _variables: Partial<NgScrollbarCssVariables>) {
  }

  get value(): string {
    return Object.keys(this._variables)
      .map((key: string) => `${[this._keyValues[key]]}: ${this._variables[key]}`)
      .join(';');
  }
}
