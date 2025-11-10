import { Component, output, OnInit, OutputEmitterRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { ColorPickerDirective } from 'ngx-color-picker';
import { CSS_VARIABLES, CssVariablesControl, CssVariablesDict, CssVariablesModel } from './css-variables.model';

@Component({
  selector: 'app-css-variables-form',
  templateUrl: './css-variables-form.component.html',
  styleUrl: './css-variables-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, ColorPickerDirective, KeyValuePipe]
})
export class CssVariablesFormComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder);

  form: FormGroup<CssVariablesDict<FormControl<string>>> = this.createCssVariablesForm(CSS_VARIABLES);

  readonly cssVariablesDict: CssVariablesControl = CSS_VARIABLES;

  value: OutputEmitterRef<CssVariablesModel<string>> = output<CssVariablesModel<string>>();

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value: CssVariablesDict<string>) => this.value.emit(value as CssVariablesModel<string>));

    // Emit first time on init
    this.value.emit(this.form.value as CssVariablesModel<string>);
  }

  createCssVariablesForm(dict: CssVariablesControl): FormGroup<CssVariablesDict<FormControl<string>>> {
    const group: Record<string, any> = {};

    for (const key in dict) {
      group[key] = [dict[key].defaultValue];
    }

    return this.fb.group(group);
  }
}
