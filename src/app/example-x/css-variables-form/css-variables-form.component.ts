import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
      color: new FormControl('rgba(0, 0, 0, 0.15)'),
      viewColor: new FormControl('transparent'),
      thumbColor: new FormControl('#2196f3'),
      thumbHoverColor: new FormControl('#2196f3'),
      containerColor: new FormControl('transparent'),
      padding: new FormControl('8px'),
      viewMargin: new FormControl('10px 0 0 10px'),
      borderRadius: new FormControl('10px')
    });

    this.form.valueChanges.subscribe((value) => this.value.next(value));

    // Emit first time on init
    this.value.emit(this.form.value);
  }

}
