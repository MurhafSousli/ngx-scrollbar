import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-css-variables-form',
  templateUrl: './css-variables-form.component.html',
  styleUrls: ['./css-variables-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ColorPickerModule]
})
export class CssVariablesFormComponent implements OnInit {
  form: FormGroup;

  @Output() value: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.form = new FormGroup({
      thickness: new FormControl('12'),
      hoverThickness: new FormControl('15'),
      trackColor: new FormControl('var(--mat-standard-button-toggle-selected-state-background-color)'),
      thumbColor: new FormControl('var(--color-primary-60)'),
      thumbHoverColor: new FormControl('var(--color-active-link)'),
      trackOffset: new FormControl('0'),
      borderRadius: new FormControl('0px'),
      overscrollBehavior: new FormControl('initial'),
      transitionDuration: new FormControl('400ms'),
      transitionDelay: new FormControl('800ms')
    });

    this.form.valueChanges.subscribe((value) => this.value.next(value));

    // Emit first time on init
    this.value.emit(this.form.value);
  }

}
