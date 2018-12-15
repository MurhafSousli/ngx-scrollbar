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
      viewColor: new FormControl('rgba(0, 254, 230, 0.15)'),
      thumbColor: new FormControl('rgba(32, 178, 170, 0.9)'),
      thumbHoverColor: new FormControl('rgba(39,208,199,0.9)'),
      containerColor: new FormControl('rgba(117, 117, 117, 0.15)'),
      padding: new FormControl('8px'),
      viewMargin: new FormControl('0'),
      borderRadius: new FormControl('10px')
    });

    this.form.valueChanges.subscribe((value) => this.value.next(value));
  }

}
