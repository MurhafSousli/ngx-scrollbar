import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { AlphaChannel, OutputFormat, SliderDimension, SliderPosition } from './helpers';

import { ColorFormats, Hsla, Hsva, Rgba } from './formats';

import { ColorPickerService } from './color-picker.service';
import { ColorPickerOptions } from './color-picker.model';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements OnInit, OnDestroy, AfterViewInit {

  private hsva: Hsva;

  private width: number;
  private height: number;

  private outputColor: string;
  private initialColor: string;
  private fallbackColor: string;

  private listenerResize: any;

  private directiveInstance: any;

  private sliderH: number;
  private sliderDimMax: SliderDimension;
  private directiveElementRef: ElementRef;

  private dialogArrowSize: number = 10;
  private dialogArrowOffset: number = 15;

  private dialogInputFields: ColorFormats[] = [
    ColorFormats.HEX,
    ColorFormats.RGBA,
    ColorFormats.HSLA
  ];

  private useRootViewContainer: boolean = false;

  public show: boolean;
  public hidden: boolean;

  public top: number;
  public left: number;
  public position: string;

  public format: ColorFormats;
  public slider: SliderPosition;

  public hexText: string;
  public hexAlpha: number;

  public hslaText: Hsla;
  public rgbaText: Rgba;

  public arrowTop: number;

  public selectedColor: string;
  public hueSliderColor: string;
  public alphaSliderColor: string;

  public cpWidth: number;
  public cpHeight: number;

  public cpColorMode: number;

  public cpAlphaChannel: AlphaChannel;
  public cpOutputFormat: OutputFormat;

  public cpDisableInput: boolean;
  public cpDialogDisplay: string;

  public cpIgnoredElements: any;
  public cpSaveClickOutside: boolean;

  public cpPosition: string;
  public cpPositionOffset: number;

  public cpOKButton: boolean;
  public cpOKButtonText: string;
  public cpOKButtonClass: string;

  public cpCancelButton: boolean;
  public cpCancelButtonText: string;
  public cpCancelButtonClass: string;

  public cpPresetLabel: string;
  public cpPresetColors: string[];
  public cpMaxPresetColorsLength: number;

  public cpPresetEmptyMessage: string;
  public cpPresetEmptyMessageClass: string;

  public cpAddColorButton: boolean;
  public cpAddColorButtonText: string;
  public cpAddColorButtonClass: string;
  public cpRemoveColorButtonClass: string;

  @ViewChild('hueSlider', {static: true}) hueSlider: ElementRef;
  @ViewChild('alphaSlider', {static: true}) alphaSlider: ElementRef;

  @HostListener('document:keyup.esc', ['$event']) handleEsc(event: any): void {
    if (this.show && this.cpDialogDisplay === 'popup') {
      this.onCancelColor(event);
    }
  }

  @HostListener('document:keyup.enter', ['$event']) handleEnter(event: any): void {
    if (this.show && this.cpDialogDisplay === 'popup') {
      this.onAcceptColor(event);
    }
  }

  constructor(private elRef: ElementRef, private cdRef: ChangeDetectorRef, private service: ColorPickerService) {
  }

  ngOnInit(): void {
    this.slider = new SliderPosition(0, 0, 0, 0);

    const hueWidth = this.hueSlider.nativeElement.offsetWidth || 140;
    const alphaWidth = this.alphaSlider.nativeElement.offsetWidth || 140;

    this.sliderDimMax = new SliderDimension(hueWidth, this.cpWidth, 130, alphaWidth);

    if (this.cpOutputFormat === 'rgba') {
      this.format = ColorFormats.RGBA;
    } else if (this.cpOutputFormat === 'hsla') {
      this.format = ColorFormats.HSLA;
    } else {
      this.format = ColorFormats.HEX;
    }

    this.listenerResize = () => {
      this.onResize();
    };

    this.openDialog(this.initialColor, false);
  }

  ngOnDestroy(): void {
    this.closeDialog();
  }

  ngAfterViewInit(): void {
    if (this.cpWidth !== 230 || this.cpDialogDisplay === 'inline') {
      const hueWidth = this.hueSlider.nativeElement.offsetWidth || 140;
      const alphaWidth = this.alphaSlider.nativeElement.offsetWidth || 140;

      this.sliderDimMax = new SliderDimension(hueWidth, this.cpWidth, 130, alphaWidth);

      this.updateColorPicker(false);

      this.cdRef.detectChanges();
    }
  }

  public openDialog(color: any, emit: boolean = true): void {
    this.service.setActive(this);

    if (!this.width) {
      this.cpWidth = this.directiveElementRef.nativeElement.offsetWidth;
    }

    if (!this.height) {
      this.height = 320;
    }

    this.setInitialColor(color);

    this.setColorFromString(color, emit);

    this.openColorPicker();
  }

  public closeDialog(): void {
    this.closeColorPicker();
  }

  public setupDialog(config: ColorPickerOptions): void {
    this.setInitialColor(config.color);

    this.setColorMode(config.cpColorMode);

    this.directiveInstance = config.instance;
    this.directiveElementRef = config.elementRef;

    this.cpDisableInput = config.cpDisableInput;

    this.cpAlphaChannel = config.cpAlphaChannel;
    this.cpOutputFormat = config.cpOutputFormat;
    this.cpDialogDisplay = config.cpDialogDisplay;

    this.cpIgnoredElements = config.cpIgnoredElements;
    this.cpSaveClickOutside = config.cpSaveClickOutside;

    this.useRootViewContainer = config.cpUseRootViewContainer;

    this.width = this.cpWidth = parseInt(config.cpWidth, 10);
    this.height = this.cpHeight = parseInt(config.cpHeight, 10);

    this.cpPosition = config.cpPosition;
    this.cpPositionOffset = parseInt(config.cpPositionOffset, 10);

    this.cpOKButton = config.cpOKButton;
    this.cpOKButtonText = config.cpOKButtonText;
    this.cpOKButtonClass = config.cpOKButtonClass;

    this.cpCancelButton = config.cpCancelButton;
    this.cpCancelButtonText = config.cpCancelButtonText;
    this.cpCancelButtonClass = config.cpCancelButtonClass;

    this.fallbackColor = config.cpFallbackColor || '#fff';

    this.setPresetConfig(config.cpPresetLabel, config.cpPresetColors);

    this.cpMaxPresetColorsLength = config.cpMaxPresetColorsLength;
    this.cpPresetEmptyMessage = config.cpPresetEmptyMessage;
    this.cpPresetEmptyMessageClass = config.cpPresetEmptyMessageClass;

    this.cpAddColorButton = config.cpAddColorButton;
    this.cpAddColorButtonText = config.cpAddColorButtonText;
    this.cpAddColorButtonClass = config.cpAddColorButtonClass;
    this.cpRemoveColorButtonClass = config.cpRemoveColorButtonClass;

    if (!config.cpPositionRelativeToArrow) {
      this.dialogArrowOffset = 0;
    }

    if (config.cpDialogDisplay === 'inline') {
      this.dialogArrowSize = 0;
      this.dialogArrowOffset = 0;
    }

    if (config.cpOutputFormat === 'hex' &&
      config.cpAlphaChannel !== 'always' && config.cpAlphaChannel !== 'forced') {
      this.cpAlphaChannel = 'disabled';
    }
  }

  public setColorMode(mode: string): void {
    switch (mode.toString().toUpperCase()) {
      case '1':
      case 'C':
      case 'COLOR':
        this.cpColorMode = 1;
        break;
      case '2':
      case 'G':
      case 'GRAYSCALE':
        this.cpColorMode = 2;
        break;
      case '3':
      case 'P':
      case 'PRESETS':
        this.cpColorMode = 3;
        break;
      default:
        this.cpColorMode = 1;
    }
  }

  public setInitialColor(color: any): void {
    this.initialColor = color;
  }

  public setPresetConfig(cpPresetLabel: string, cpPresetColors: string[]): void {
    this.cpPresetLabel = cpPresetLabel;
    this.cpPresetColors = cpPresetColors;
  }

  public setColorFromString(value: string, emit: boolean = true, update: boolean = true): void {
    let hsva: Hsva | null;

    if (this.cpAlphaChannel === 'always' || this.cpAlphaChannel === 'forced') {
      hsva = this.service.stringToHsva(value, true);

      if (!hsva && !this.hsva) {
        hsva = this.service.stringToHsva(value, false);
      }
    } else {
      hsva = this.service.stringToHsva(value, false);
    }

    if (!hsva && !this.hsva) {
      hsva = this.service.stringToHsva(this.fallbackColor, false);
    }

    if (hsva) {
      this.hsva = hsva;

      this.sliderH = this.hsva.h;

      this.updateColorPicker(emit, update);
    }
  }

  public onResize(): void {
    if (this.position === 'fixed') {
      // this.setDialogPosition();
    } else if (this.cpDialogDisplay !== 'inline') {
      this.closeColorPicker();
    }
  }

  public onDragEnd(slider: string): void {
    this.directiveInstance.sliderDragEnd({slider: slider, color: this.outputColor});
  }

  public onDragStart(slider: string): void {
    this.directiveInstance.sliderDragStart({slider: slider, color: this.outputColor});
  }

  public onAcceptColor(event: Event): void {
    event.stopPropagation();

    if (this.cpDialogDisplay === 'popup') {
      this.closeColorPicker();
    }

    if (this.outputColor) {
      this.directiveInstance.colorSelected(this.outputColor);
    }
  }

  public onCancelColor(event: Event): void {
    event.stopPropagation();

    this.setColorFromString(this.initialColor, true);

    if (this.cpDialogDisplay === 'popup') {
      this.directiveInstance.colorChanged(this.initialColor, true);

      this.closeColorPicker();
    }

    this.directiveInstance.colorCanceled();
  }

  public onFormatToggle(change: number): void {
    const availableFormats = this.dialogInputFields.length;

    const nextFormat = (((this.dialogInputFields.indexOf(this.format) + change) %
      availableFormats) + availableFormats) % availableFormats;

    this.format = this.dialogInputFields[nextFormat];
  }

  public onColorChange(value: { s: number, v: number, rgX: number, rgY: number }): void {
    this.hsva.s = value.s / value.rgX;
    this.hsva.v = value.v / value.rgY;

    this.updateColorPicker();

    this.directiveInstance.sliderChanged({
      slider: 'lightness',
      value: this.hsva.v,
      color: this.outputColor
    });

    this.directiveInstance.sliderChanged({
      slider: 'saturation',
      value: this.hsva.s,
      color: this.outputColor
    });
  }

  public onHueChange(value: { v: number, rgX: number }): void {
    this.hsva.h = value.v / value.rgX;
    this.sliderH = this.hsva.h;

    this.updateColorPicker();

    this.directiveInstance.sliderChanged({
      slider: 'hue',
      value: this.hsva.h,
      color: this.outputColor
    });
  }

  public onValueChange(value: { v: number, rgX: number }): void {
    this.hsva.v = value.v / value.rgX;

    this.updateColorPicker();

    this.directiveInstance.sliderChanged({
      slider: 'value',
      value: this.hsva.v,
      color: this.outputColor
    });
  }

  public onAlphaChange(value: { v: number, rgX: number }): void {
    this.hsva.a = value.v / value.rgX;

    this.updateColorPicker();

    this.directiveInstance.sliderChanged({
      slider: 'alpha',
      value: this.hsva.a,
      color: this.outputColor
    });
  }

  public onHexInput(value: string | null): void {
    if (value === null) {
      this.updateColorPicker();
    } else {
      if (value && value[0] !== '#') {
        value = '#' + value;
      }

      let validHex = /^#([a-f0-9]{3}|[a-f0-9]{6})$/gi;

      if (this.cpAlphaChannel === 'always') {
        validHex = /^#([a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/gi;
      }

      if (validHex.test(value)) {
        if (value.length < 5) {
          value = '#' + value.substring(1)
            .split('')
            .map(c => c + c)
            .join('');
        }

        if (this.cpAlphaChannel === 'forced') {
          value += Math.round(this.hsva.a * 255).toString(16);
        }

        this.setColorFromString(value, true, false);

        this.directiveInstance.inputChanged({
          input: 'hex',
          value: value,
          color: this.outputColor
        });
      }
    }
  }

  public onRedInput(value: { v: number, rg: number }): void {
    const rgba = this.service.hsvaToRgba(this.hsva);

    rgba.r = value.v / value.rg;

    this.hsva = this.service.rgbaToHsva(rgba);

    this.sliderH = this.hsva.h;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'red',
      value: rgba.r,
      color: this.outputColor
    });
  }

  public onBlueInput(value: { v: number, rg: number }): void {
    const rgba = this.service.hsvaToRgba(this.hsva);

    rgba.b = value.v / value.rg;

    this.hsva = this.service.rgbaToHsva(rgba);

    this.sliderH = this.hsva.h;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'blue',
      value: rgba.b,
      color: this.outputColor
    });
  }

  public onGreenInput(value: { v: number, rg: number }): void {
    const rgba = this.service.hsvaToRgba(this.hsva);

    rgba.g = value.v / value.rg;

    this.hsva = this.service.rgbaToHsva(rgba);

    this.sliderH = this.hsva.h;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'green',
      value: rgba.g,
      color: this.outputColor
    });
  }

  public onHueInput(value: { v: number, rg: number }) {
    this.hsva.h = value.v / value.rg;

    this.sliderH = this.hsva.h;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'hue',
      value: this.hsva.h,
      color: this.outputColor
    });
  }

  public onValueInput(value: { v: number, rg: number }): void {
    this.hsva.v = value.v / value.rg;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'value',
      value: this.hsva.v,
      color: this.outputColor
    });
  }

  public onAlphaInput(value: { v: number, rg: number }): void {
    this.hsva.a = value.v / value.rg;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'alpha',
      value: this.hsva.a,
      color: this.outputColor
    });
  }

  public onLightnessInput(value: { v: number, rg: number }): void {
    const hsla = this.service.hsva2hsla(this.hsva);

    hsla.l = value.v / value.rg;

    this.hsva = this.service.hsla2hsva(hsla);

    this.sliderH = this.hsva.h;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'lightness',
      value: hsla.l,
      color: this.outputColor
    });
  }

  public onSaturationInput(value: { v: number, rg: number }): void {
    const hsla = this.service.hsva2hsla(this.hsva);

    hsla.s = value.v / value.rg;

    this.hsva = this.service.hsla2hsva(hsla);

    this.sliderH = this.hsva.h;

    this.updateColorPicker();

    this.directiveInstance.inputChanged({
      input: 'saturation',
      value: hsla.s,
      color: this.outputColor
    });
  }

  public onAddPresetColor(event: any, value: string): void {
    event.stopPropagation();

    if (!this.cpPresetColors.filter((color) => (color === value)).length) {
      this.cpPresetColors = this.cpPresetColors.concat(value);

      this.directiveInstance.presetColorsChanged(this.cpPresetColors);
    }
  }

  public onRemovePresetColor(event: any, value: string): void {
    event.stopPropagation();

    this.cpPresetColors = this.cpPresetColors.filter((color) => (color !== value));

    this.directiveInstance.presetColorsChanged(this.cpPresetColors);
  }

  // Private helper functions for the color picker dialog status

  private openColorPicker(): void {
    this.directiveInstance.stateChanged(true);

    window.addEventListener('resize', this.listenerResize);
  }

  private closeColorPicker(): void {
    if (this.show) {
      this.show = false;

      this.directiveInstance.stateChanged(false);

      window.removeEventListener('resize', this.listenerResize);

      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    }
  }

  private updateColorPicker(emit: boolean = true, update: boolean = true): void {
    if (this.sliderDimMax) {
      if (this.cpColorMode === 2) {
        this.hsva.s = 0;
      }

      const lastOutput = this.outputColor;

      const hsla = this.service.hsva2hsla(this.hsva);
      const rgba = this.service.denormalizeRGBA(this.service.hsvaToRgba(this.hsva));

      const hue = this.service.denormalizeRGBA(this.service.hsvaToRgba(new Hsva(this.sliderH || this.hsva.h, 1, 1, 1)));

      if (update) {
        this.hslaText = new Hsla(Math.round((hsla.h) * 360), Math.round(hsla.s * 100), Math.round(hsla.l * 100),
          Math.round(hsla.a * 100) / 100);

        this.rgbaText = new Rgba(rgba.r, rgba.g, rgba.b, Math.round(rgba.a * 100) / 100);

        const allowHex8 = this.cpAlphaChannel === 'always';

        this.hexText = this.service.rgbaToHex(rgba, allowHex8);
        this.hexAlpha = this.rgbaText.a;
      }

      if (this.cpOutputFormat === 'auto') {
        if (this.hsva.a < 1) {
          this.format = this.hsva.a < 1 ? ColorFormats.RGBA : ColorFormats.HEX;
        }
      }

      this.hueSliderColor = `rgba(${hue.r}, ${hue.g}, ${hue.b})`;
      this.alphaSliderColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b})`;

      this.outputColor = this.service.outputFormat(this.hsva, this.cpOutputFormat, this.cpAlphaChannel);
      this.selectedColor = this.service.outputFormat(this.hsva, 'rgba', null);

      this.slider = new SliderPosition(
        (this.sliderH || this.hsva.h) * this.sliderDimMax.h - 8,
        this.hsva.s * this.sliderDimMax.s - 8,
        (1 - this.hsva.v) * this.sliderDimMax.v - 8,
        this.hsva.a * this.sliderDimMax.a - 8
      );

      if (emit && lastOutput !== this.outputColor) {
        this.directiveInstance.colorChanged(this.outputColor);
      }
    }
  }

}
