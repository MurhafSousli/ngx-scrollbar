import { Component, ChangeDetectionStrategy, Output, EventEmitter, DoCheck, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  standalone: true,
  selector: 'app-smooth-scroll-form',
  templateUrl: './smooth-scroll-form.component.html',
  styleUrls: ['./smooth-scroll-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonToggleModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class SmoothScrollFormComponent implements DoCheck {
  displayFunction: string;
  scrollToElementSelected: boolean;

  options: SmoothScrollOptionsForm = {
    scrollFunc: 'scrollTo',
    duration: 800,
    axisYProperty: 'bottom',
    axisYValue: 0,
    axisXProperty: 'end',
    axisXValue: 0
  };

  @Input() reached: boolean;
  @Output('scrollToElementSelected') scrollToElement: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() scrollTo: EventEmitter<SmoothScrollOptionsForm> = new EventEmitter<SmoothScrollOptionsForm>();

  ngDoCheck() {
    const axisX: string = this.options.axisXProperty === 'unset' ? '' : `${ this.options.axisXProperty }: ${ this.options.axisXValue }`;
    const axisY: string = this.options.axisYProperty === 'unset' ? '' : `${ this.options.axisYProperty }: ${ this.options.axisYValue }`;
    const comma: string = this.options.axisXProperty !== 'unset' && this.options.axisYProperty !== 'unset' ? ', ' : '';
    const durationComma: string = this.options.axisXProperty !== 'unset' || this.options.axisYProperty !== 'unset' ? ', ' : '';
    if (this.options.scrollFunc === 'scrollToElement') {
      this.displayFunction =
        `scrollToElement('#target', {${ axisY }${ comma }${ axisX }${ durationComma }duration: ${ this.options.duration }})`;
    } else {
      this.displayFunction =
        `scrollTo({${ axisY }${ comma }${ axisX }${ durationComma }duration: ${ this.options.duration }})`;
    }
  }

  scrollFuncChanged(e: string) {
    this.scrollToElementSelected = e === 'scrollToElement';
    if (this.scrollToElementSelected) {
      this.options.axisXProperty = 'unset';
      this.options.axisYProperty = 'unset';
    }
    this.scrollToElement.emit(this.scrollToElementSelected);
  }

  play() {
    this.scrollTo.emit(this.options);
  }
}

export interface SmoothScrollOptionsForm {
  scrollFunc: string;
  duration: number;
  axisYProperty: string;
  axisYValue: number;
  axisXProperty: string;
  axisXValue: number;
}
