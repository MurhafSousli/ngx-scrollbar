import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-toggle-form',
  template: `
    <mat-slide-toggle [(ngModel)]="value.disabled">Disabled</mat-slide-toggle>
    <mat-slide-toggle [(ngModel)]="value.sensorDisabled">Sensor Disabled</mat-slide-toggle>
    <mat-slide-toggle [(ngModel)]="value.rtl">RTL</mat-slide-toggle>
    <mat-slide-toggle color="warn" [(ngModel)]="value.highlight">Highlight</mat-slide-toggle>
  `,
  styleUrls: ['./toggle-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleFormComponent implements AfterViewChecked {

  @Input() value: ToggleChange;
  @Output() valueChange = new EventEmitter<ToggleChange>();

  ngAfterViewChecked() {
    this.valueChange.emit(this.value);
  }

}

export interface ToggleChange {
  disabled: boolean;
  sensorDisabled: boolean;
  rtl: boolean;
  highlight: boolean;
}
