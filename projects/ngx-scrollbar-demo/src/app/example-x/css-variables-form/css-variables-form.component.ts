import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-css-variables-form',
  templateUrl: './css-variables-form.component.html',
  styleUrls: ['./css-variables-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CssVariablesFormComponent implements OnInit {
  form: FormGroup;

  @Output() value = new EventEmitter();

  ngOnInit() {
    this.form = new FormGroup({
      size: new FormControl('8px'),
      hoverSize: new FormControl('12px'),
      trackColor: new FormControl('rgba(0, 0, 0, 0.15)'),
      thumbColor: new FormControl('var(--color-scrollbar-example-x)'),
      thumbHoverColor: new FormControl('var(--color-scrollbar-example-x)'),
      trackPadding: new FormControl('4px'),
      borderRadius: new FormControl('10px'),
      overscrollBehavior: new FormControl('initial'),
      transitionDuration: new FormControl('400ms'),
      transitionDelay: new FormControl('800ms')
    });

    this.form.valueChanges.subscribe((value) => this.value.next(value));

    // Emit first time on init
    this.value.emit(this.form.value);
  }

}
