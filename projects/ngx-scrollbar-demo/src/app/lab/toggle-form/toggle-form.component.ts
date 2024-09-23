import { Component, model, ModelSignal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  standalone: true,
  selector: 'app-toggle-form',
  template: `
    <mat-slide-toggle [(ngModel)]="value().disableSensor">Disable Resize Sensor</mat-slide-toggle>
    <mat-slide-toggle [(ngModel)]="value().disableReached">Disable Reached Events</mat-slide-toggle>
    <mat-slide-toggle [(ngModel)]="value().rtl">RTL</mat-slide-toggle>
    <mat-slide-toggle color="warn" [(ngModel)]="value().highlight">Highlight</mat-slide-toggle>
  `,
  styleUrl: './toggle-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggleModule, FormsModule]
})
export class ToggleFormComponent {
  value: ModelSignal<ToggleChange> = model<ToggleChange>();
}

export interface ToggleChange {
  disableSensor: boolean;
  disableReached: boolean;
  rtl: boolean;
  highlight: boolean;
}
