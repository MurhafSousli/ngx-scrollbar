import { ElementRef } from '@angular/core';
import { AlphaChannel, OutputFormat } from './helpers';

export interface ColorPickerOptions {
  instance: any;
  elementRef: ElementRef;
  color: any;
  cpWidth: string;
  cpHeight: string;
  cpDialogDisplay: string;
  cpFallbackColor: string;
  cpColorMode: string;
  cpAlphaChannel: AlphaChannel;
  cpOutputFormat: OutputFormat;
  cpDisableInput: boolean;
  cpIgnoredElements: any;
  cpSaveClickOutside: boolean;
  cpUseRootViewContainer: boolean;
  cpPosition: string;
  cpPositionOffset: string;
  cpPositionRelativeToArrow: boolean;
  cpPresetLabel: string;
  cpPresetColors: string[];
  cpMaxPresetColorsLength: number;
  cpPresetEmptyMessage: string;
  cpPresetEmptyMessageClass: string;
  cpOKButton: boolean;
  cpOKButtonClass: string;
  cpOKButtonText: string;
  cpCancelButton: boolean;
  cpCancelButtonClass: string;
  cpCancelButtonText: string;
  cpAddColorButton: boolean;
  cpAddColorButtonClass: string;
  cpAddColorButtonText: string;
  cpRemoveColorButtonClass: string;
}
