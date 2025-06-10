import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExampleNgxDatatableComponent } from '../example-ngx-datatable/example-ngx-datatable.component';
import { ExampleInfiniteScrollComponent } from '../example-infinite-scroll/example-infinite-scroll.component';
import { ExampleAgGridTableComponent } from '../example-ag-grid-table/example-ag-grid-table.component';
import { ExamplePrimeNgComponent } from '../example-prime-ng-table/example-prime-ng.component';

@Component({
  selector: 'app-integration-page',
  templateUrl: './integration-page.component.html',
  styleUrl: './integration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ExamplePrimeNgComponent,
    ExampleAgGridTableComponent,
    ExampleNgxDatatableComponent,
    ExampleInfiniteScrollComponent
  ]
})
export class IntegrationPageComponent {

}
