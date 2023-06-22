import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-resize-form',
  templateUrl: './resize-form.component.html',
  styleUrls: ['./resize-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatSliderModule, FormsModule]
})
export class ResizeFormComponent implements AfterViewChecked {

  @Input() value: ResizeChange;
  @Output() valueChange = new EventEmitter<ResizeChange>();

  ngAfterViewChecked() {
    this.valueChange.emit(this.value);
  }

  contentWidthDisplayWith(value: number) {
    return `x${ value / 100 }`;
  }
}

export interface ResizeChange {
  contentWidth: number;
  contentSize: number;
  componentSize: number;
}
