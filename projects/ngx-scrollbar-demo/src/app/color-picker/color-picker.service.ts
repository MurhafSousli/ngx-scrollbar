import { Injectable } from '@angular/core';

import { Cmyk, Rgba, Hsla, Hsva } from './formats';

import { ColorPickerComponent } from './color-picker.component';

@Injectable()
export class ColorPickerService {
  private active: ColorPickerComponent | null = null;

  public setActive(active: ColorPickerComponent | null): void {
    if (this.active && this.active !== active && this.active.cpDialogDisplay !== 'inline') {
      this.active.closeDialog();
    }

    this.active = active;
  }

  public hsva2hsla(hsva: Hsva): Hsla {
    const h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;

    if (v === 0) {
      return new Hsla(h, 0, 0, a);
    } else if (s === 0 && v === 1) {
      return new Hsla(h, 1, 1, a);
    } else {
      const l = v * (2 - s) / 2;

      return new Hsla(h, v * s / (1 - Math.abs(2 * l - 1)), l, a);
    }
  }

  public hsla2hsva(hsla: Hsla): Hsva {
    const h = Math.min(hsla.h, 1), s = Math.min(hsla.s, 1);
    const l = Math.min(hsla.l, 1), a = Math.min(hsla.a, 1);

    if (l === 0) {
      return new Hsva(h, 0, 0, a);
    } else {
      const v = l + s * (1 - Math.abs(2 * l - 1)) / 2;

      return new Hsva(h, 2 * (v - l) / v, v, a);
    }
  }

  public hsvaToRgba(hsva: Hsva): Rgba {
    let r: number, g: number, b: number;

    const h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;
        break;
      case 1:
        r = q, g = v, b = p;
        break;
      case 2:
        r = p, g = v, b = t;
        break;
      case 3:
        r = p, g = q, b = v;
        break;
      case 4:
        r = t, g = p, b = v;
        break;
      case 5:
        r = v, g = p, b = q;
        break;
      default:
        r = 0, g = 0, b = 0;
    }

    return new Rgba(r, g, b, a);
  }

  public rgbaToCmyk(rgba: Rgba): Cmyk {
    const k: number = 1 - Math.max(rgba.r, rgba.g, rgba.b);

    if (k === 1) {
      return new Cmyk(0, 0, 0, 1);
    } else {
      const c = (1 - rgba.r - k) / (1 - k);
      const m = (1 - rgba.g - k) / (1 - k);
      const y = (1 - rgba.b - k) / (1 - k);

      return new Cmyk(c, m, y, k);
    }
  }

  public rgbaToHsva(rgba: Rgba): Hsva {
    let h: number, s: number;

    const r = Math.min(rgba.r, 1), g = Math.min(rgba.g, 1);
    const b = Math.min(rgba.b, 1), a = Math.min(rgba.a, 1);

    const max = Math.max(r, g, b), min = Math.min(r, g, b);

    const v: number = max, d = max - min;

    s = (max === 0) ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }

      h /= 6;
    }

    return new Hsva(h, s, v, a);
  }

  public rgbaToHex(rgba: Rgba, allowHex8?: boolean): string {
    /* tslint:disable:no-bitwise */
    let hex = '#' + ((1 << 24) | (rgba.r << 16) | (rgba.g << 8) | rgba.b).toString(16).substr(1);

    if (allowHex8) {
      hex += ((1 << 8) | Math.round(rgba.a * 255)).toString(16).substr(1);
    }
    /* tslint:enable:no-bitwise */

    return hex;
  }

  public denormalizeRGBA(rgba: Rgba): Rgba {
    return new Rgba(Math.round(rgba.r * 255), Math.round(rgba.g * 255), Math.round(rgba.b * 255), rgba.a);
  }

  public stringToHsva(colorString: string = '', allowHex8: boolean = false): Hsva | null {
    let hsva: Hsva | null = null;

    colorString = (colorString || '').toLowerCase();

    const stringParsers = [
      {
        re: /(rgb)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*%?,\s*(\d{1,3})\s*%?(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: function (execResult: any) {
          return new Rgba(parseInt(execResult[2], 10) / 255,
            parseInt(execResult[3], 10) / 255,
            parseInt(execResult[4], 10) / 255,
            isNaN(parseFloat(execResult[5])) ? 1 : parseFloat(execResult[5]));
        }
      }, {
        re: /(hsl)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: function (execResult: any) {
          return new Hsla(parseInt(execResult[2], 10) / 360,
            parseInt(execResult[3], 10) / 100,
            parseInt(execResult[4], 10) / 100,
            isNaN(parseFloat(execResult[5])) ? 1 : parseFloat(execResult[5]));
        }
      }
    ];

    if (allowHex8) {
      stringParsers.push({
        re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})?$/,
        parse: function (execResult: any) {
          return new Rgba(parseInt(execResult[1], 16) / 255,
            parseInt(execResult[2], 16) / 255,
            parseInt(execResult[3], 16) / 255,
            parseInt(execResult[4] || 'FF', 16) / 255);
        }
      });
    } else {
      stringParsers.push({
        re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/,
        parse: function (execResult: any) {
          return new Rgba(parseInt(execResult[1], 16) / 255,
            parseInt(execResult[2], 16) / 255,
            parseInt(execResult[3], 16) / 255,
            1);
        }
      });
    }

    stringParsers.push({
      re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/,
      parse: function (execResult: any) {
        return new Rgba(parseInt(execResult[1] + execResult[1], 16) / 255,
          parseInt(execResult[2] + execResult[2], 16) / 255,
          parseInt(execResult[3] + execResult[3], 16) / 255,
          1);
      }
    });

    for (const key in stringParsers) {
      if (stringParsers.hasOwnProperty(key)) {
        const parser = stringParsers[key];

        const match = parser.re.exec(colorString), color: any = match && parser.parse(match);

        if (color) {
          if (color instanceof Rgba) {
            hsva = this.rgbaToHsva(color);
          } else if (color instanceof Hsla) {
            hsva = this.hsla2hsva(color);
          }

          return hsva;
        }
      }
    }

    return hsva;
  }

  public outputFormat(hsva: Hsva, outputFormat: string, alphaChannel: string | null): string {
    if (outputFormat === 'auto') {
      outputFormat = hsva.a < 1 ? 'rgba' : 'hex';
    }

    switch (outputFormat) {
      case 'hsla':
        const hsla = this.hsva2hsla(hsva);

        const hslaText = new Hsla(Math.round((hsla.h) * 360), Math.round(hsla.s * 100),
          Math.round(hsla.l * 100), Math.round(hsla.a * 100) / 100);

        if (hsva.a < 1 || alphaChannel === 'always') {
          return 'hsla(' + hslaText.h + ',' + hslaText.s + '%,' + hslaText.l + '%,' +
            hslaText.a + ')';
        } else {
          return 'hsl(' + hslaText.h + ',' + hslaText.s + '%,' + hslaText.l + '%)';
        }

      case 'rgba':
        const rgba = this.denormalizeRGBA(this.hsvaToRgba(hsva));

        if (hsva.a < 1 || alphaChannel === 'always') {
          return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' +
            Math.round(rgba.a * 100) / 100 + ')';
        } else {
          return 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
        }

      default:
        const allowHex8 = (alphaChannel === 'always' || alphaChannel === 'forced');

        return this.rgbaToHex(this.denormalizeRGBA(this.hsvaToRgba(hsva)), allowHex8);
    }
  }
}
