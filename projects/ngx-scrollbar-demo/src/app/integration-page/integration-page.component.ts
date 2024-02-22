import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExampleNgxDatatableComponent } from '../example-ngx-datatable/example-ngx-datatable.component';
import { ExampleInfiniteScrollComponent } from '../example-infinite-scroll/example-infinite-scroll.component';
import { ExampleAgGridTableComponent } from '../example-ag-grid-table/example-ag-grid-table.component';
import { PrimeNgTableComponent } from '../prime-ng-table/prime-ng-table.component';

@Component({
  selector: 'app-integration-page',
  standalone: true,
  imports: [
    ExampleNgxDatatableComponent,
    ExampleInfiniteScrollComponent,
    ExampleAgGridTableComponent,
    PrimeNgTableComponent
  ],
  templateUrl: './integration-page.component.html',
  styleUrl: './integration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationPageComponent {

}
