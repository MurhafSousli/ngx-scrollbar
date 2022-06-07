import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-css-variables-form',
  templateUrl: './css-variables-form.component.html',
  styleUrls: ['./css-variables-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CssVariablesFormComponent implements OnInit {
  form: UntypedFormGroup;

  @Output() value = new EventEmitter();

  ngOnInit() {
    this.form = new UntypedFormGroup({
      size: new UntypedFormControl('8px'),
      hoverSize: new UntypedFormControl('12px'),
      trackColor: new UntypedFormControl('rgba(0, 0, 0, 0.15)'),
      thumbColor: new UntypedFormControl('var(--color-scrollbar-example-x)'),
      thumbHoverColor: new UntypedFormControl('var(--color-scrollbar-example-x)'),
      trackPadding: new UntypedFormControl('4px'),
      borderRadius: new UntypedFormControl('10px'),
      overscrollBehavior: new UntypedFormControl('initial'),
      transitionDuration: new UntypedFormControl('400ms'),
      transitionDelay: new UntypedFormControl('800ms')
    });

    this.form.valueChanges.subscribe((value) => this.value.next(value));

    // Emit first time on init
    this.value.emit(this.form.value);
  }

}
