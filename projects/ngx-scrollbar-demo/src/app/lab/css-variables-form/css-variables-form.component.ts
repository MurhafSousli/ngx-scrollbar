import { Component, output, OnInit, OutputEmitterRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';

@Component({
  selector: 'app-css-variables-form',
  templateUrl: './css-variables-form.component.html',
  styleUrl: './css-variables-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, ColorPickerDirective]
})
export class CssVariablesFormComponent implements OnInit {
  form: FormGroup;

  value: OutputEmitterRef<any> = output();

  ngOnInit(): void {
    this.form = new FormGroup({
      thickness: new FormControl('12px'),
      hoverThickness: new FormControl('15px'),
      trackColor: new FormControl('#5b4130'),
      thumbColor: new FormControl('var(--color-primary)'),
      thumbHoverColor: new FormControl('var(--color-active-link)'),
      trackOffset: new FormControl('8px'),
      borderRadius: new FormControl('8px'),
      overscrollBehavior: new FormControl('initial'),
      transitionDuration: new FormControl('400ms'),
      transitionDelay: new FormControl('800ms')
    });

    this.form.valueChanges.subscribe((value) => this.value.emit(value));

    // Emit first time on init
    this.value.emit(this.form.value);
  }

}
