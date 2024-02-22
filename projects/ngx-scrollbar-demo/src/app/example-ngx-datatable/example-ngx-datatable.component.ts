import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { NgScrollbarExt, ScrollbarExtAsyncDetection } from 'ngx-scrollbar';

interface Employee {
  name: string;
  age: number;
  gender: string;
  company: string;
}

@Component({
  selector: 'app-example-ngx-datatable',
  standalone: true,
  imports: [
    NgxDatatableModule,
    NgScrollbarExt,
    ScrollbarExtAsyncDetection,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './example-ngx-datatable.component.html',
  styleUrl: './example-ngx-datatable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleNgxDatatableComponent implements OnInit {

  http: HttpClient = inject(HttpClient);

  rows: WritableSignal<Employee[]> = signal([]);

  ColumnMode = ColumnMode;

  ngOnInit() {
    this.http.get(`https://raw.githubusercontent.com/swimlane/ngx-datatable/master/src/assets/data/company.json`).subscribe((data: Employee[]) => {
      this.rows.set(data);
    });
  }

}
