import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgScrollbarMatTimepicker } from 'ngx-scrollbar/mat';

@Component({
  selector: 'app-example-mat-timepicker',
  templateUrl: './example-mat-timepicker.component.html',
  styleUrl: './example-mat-timepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatTimepickerModule, NgScrollbarMatTimepicker, MatCardModule]
})
export class ExampleMatTimepickerComponent {
}
