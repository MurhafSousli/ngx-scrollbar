import {
  Component,
  output,
  signal,
  effect,
  computed,
  input,
  Signal,
  InputSignal,
  WritableSignal,
  OutputEmitterRef,
  ChangeDetectionStrategy
} from '@angular/core';
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
export class SmoothScrollFormComponent {
  scrollToElementSelected: boolean;

  scrollFunc: WritableSignal<string> = signal('scrollTo');
  duration: WritableSignal<number> = signal(800);
  axisYProperty: WritableSignal<string> = signal('bottom');
  axisYValue: WritableSignal<number> = signal(0);
  axisXProperty: WritableSignal<string> = signal('end');
  axisXValue: WritableSignal<number> = signal(0);
  center: WritableSignal<boolean> =  signal(false);

  options: Signal<SmoothScrollOptionsForm> = computed(() => {
    return {
      scrollFunc: this.scrollFunc(),
      duration: this.duration(),
      axisYProperty: this.axisYProperty(),
      axisYValue: this.axisYValue(),
      axisXProperty: this.axisXProperty(),
      axisXValue: this.axisXValue(),
      center: this.center()
    }
  });

  displayFunction: Signal<string> = computed(() => {
    const center: boolean = this.center();
    if (center) {
      return `scrollToElement('#target', { center: true , duration: ${ this.duration() }})`;
    }
    const axisX: string = this.axisXProperty() === 'unset' ? '' : `${ this.axisXProperty() }: ${ this.axisXValue() }`;
    const axisY: string = this.axisYProperty() === 'unset' ? '' : `${ this.axisYProperty() }: ${ this.axisYValue() }`;
    const comma: string = this.axisXProperty() !== 'unset' && this.axisYProperty() !== 'unset' ? ', ' : '';
    const durationComma: string = this.axisXProperty() !== 'unset' || this.axisYProperty() !== 'unset' ? ', ' : '';
    if (this.scrollFunc() === 'scrollToElement') {
      return `scrollToElement('#target', {${ axisY }${ comma }${ axisX }${ durationComma }duration: ${ this.duration() }})`;
    }
    return `scrollTo({${ axisY }${ comma }${ axisX }${ durationComma }duration: ${ this.duration() }})`;
  });

  reached: InputSignal<boolean> = input<boolean>();

  scrollToElement: OutputEmitterRef<boolean> = output<boolean>({ alias: 'scrollToElementSelected' });

  scrollTo: OutputEmitterRef<SmoothScrollOptionsForm> = output<SmoothScrollOptionsForm>();

  constructor() {
    effect(() => {
      this.scrollToElementSelected = this.scrollFunc() === 'scrollToElement';
      this.scrollToElement.emit(this.scrollToElementSelected);
    });
  }
}

export interface SmoothScrollOptionsForm {
  scrollFunc: string;
  duration: number;
  axisYProperty: string;
  axisYValue: number;
  axisXProperty: string;
  axisXValue: number;
  center: boolean;
}
