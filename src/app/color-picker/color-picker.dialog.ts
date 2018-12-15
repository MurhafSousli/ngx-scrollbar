import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerOptions } from './color-picker.model';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerDialog {
  private _overlayRef: OverlayRef;

  constructor(private _overlay: Overlay) {
  }

  /**
   * Open color picker
   * @param el
   * @param config
   */
  open(el: ElementRef, config: ColorPickerOptions) {
    this.close();

    this._overlayRef = this._overlay.create({
      backdropClass: 'color-picker-dialog',
      positionStrategy: this._overlay.position().flexibleConnectedTo(el).withPositions([
        new ConnectionPositionPair(
          {originX: 'end', originY: 'top'},
          {overlayX: 'start', overlayY: 'top'}
        )]
      ),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      hasBackdrop: true
    });

    // if (_config.hasBackdrop) {
    this._overlayRef.backdropClick().subscribe(() => this.close());
    // }

    const colorPickerPortal = new ComponentPortal(ColorPickerComponent);
    const colorPickerRef: ComponentRef<ColorPickerComponent> = this._overlayRef.attach(colorPickerPortal);
    colorPickerRef.instance.setupDialog(config);
  }

  /**
   * Close color picker overlay
   */
  close() {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }
}
