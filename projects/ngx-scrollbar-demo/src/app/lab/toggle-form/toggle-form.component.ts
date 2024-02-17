import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toggle-form',
  template: `
    <mat-slide-toggle [(ngModel)]="value.disableSensor">Disable Resize Sensor</mat-slide-toggle>
    <mat-slide-toggle [(ngModel)]="value.disableReached">Disable Reached Events</mat-slide-toggle>
    <mat-slide-toggle [(ngModel)]="value.rtl">RTL</mat-slide-toggle>
    <mat-slide-toggle color="warn" [(ngModel)]="value.highlight">Highlight</mat-slide-toggle>
  `,
  styleUrls: ['./toggle-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatSlideToggleModule, FormsModule]
})
export class ToggleFormComponent implements AfterViewChecked {

  @Input() value: ToggleChange;
  @Output() valueChange = new EventEmitter<ToggleChange>();

  ngAfterViewChecked() {
    this.valueChange.emit(this.value);
  }

}

export interface ToggleChange {
  disableSensor: boolean;
  disableReached: boolean;
  rtl: boolean;
  highlight: boolean;
}
