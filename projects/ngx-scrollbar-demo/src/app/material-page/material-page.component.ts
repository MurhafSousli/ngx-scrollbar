import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {  MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ExampleVirtualScrollComponent } from '../example-virutal-scroll/example-virtual-scroll.component';
import { ExampleMatSelectComponent } from '../example-mat-select/example-mat-select.component';
import {
  ExampleNestedVirtualScrollComponent
} from '../example-nested-virtual-scroll/example-nested-virtual-scroll.component';
import { ExampleVirtualScrollExtComponent } from '../example-virtual-scroll-ext/example-virtual-scroll-ext.component';
import { ExampleMatDialogComponent } from '../example-mat-dialog/example-mat-dialog.component';
import { ExampleMatAutocompleteComponent } from '../example-mat-autocomplete/example-mat-autocomplete.component';
import { ExampleMatTableComponent } from '../example-mat-table/example-mat-table.component';

@Component({
  selector: 'app-material-page',
  templateUrl: './material-page.component.html',
  styleUrl: './material-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    ExampleMatSelectComponent,
    ExampleVirtualScrollComponent,
    ExampleVirtualScrollExtComponent,
    ExampleNestedVirtualScrollComponent,
    ExampleMatAutocompleteComponent,
    ExampleMatTableComponent
  ],
})
export class MaterialPageComponent {
  private readonly dialog: MatDialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(ExampleMatDialogComponent);
  }
}
