import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgScrollbarMatAutocomplete } from 'ngx-scrollbar/mat';

@Component({
  selector: 'app-example-mat-autocomplete',
  templateUrl: './example-mat-autocomplete.component.html',
  styleUrl: './example-mat-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgScrollbarMatAutocomplete
  ],
})
export class ExampleMatAutocompleteComponent {
  myControl: FormControl<string> = new FormControl('');
  options: string[] = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
}
