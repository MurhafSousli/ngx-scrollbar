import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { NgScrollbar, NgScrollbarExt, ScrollbarExtAsyncDetection } from 'ngx-scrollbar';

@Component({
  selector: 'app-example-ag-grid-table',
  standalone: true,
  imports: [
    AgGridAngular,
    NgScrollbar,
    NgScrollbarExt,
    ScrollbarExtAsyncDetection
  ],
  templateUrl: './example-ag-grid-table.component.html',
  styleUrl: './example-ag-grid-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleAgGridTableComponent {
  // Row Data: The data to be displayed.
  rowData: any[] = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },

    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },

    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },

    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  // Column Definitions: Defines & controls grid columns.
  colDefs: any[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ];
}
