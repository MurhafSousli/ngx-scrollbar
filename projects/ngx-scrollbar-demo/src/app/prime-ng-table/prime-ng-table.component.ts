import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { NgScrollbarExt, ScrollbarExtAsyncDetection } from 'ngx-scrollbar';
import { Chance } from 'chance';

interface Column {
  field: string;
  header: string;
}
interface Car {
  vin: string;
  brand: string;
  year: number;
  color: string;
}

@Component({
  selector: 'app-prime-ng-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    NgScrollbarExt,
    ScrollbarExtAsyncDetection,
    MatCardModule
  ],
  templateUrl: './prime-ng-table.component.html',
  styleUrl: './prime-ng-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimeNgTableComponent implements OnInit {

  chance = new Chance();

  cars!: Car[];

  virtualCars!: Car[];

  cols!: Column[];

  ngOnInit() {
    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];

    this.cars = Array.from({ length: 1000 }).map((_, i) => {
      return {
        vin: this.chance.last({ nationality: 'en' }),
        brand: this.chance.last({ nationality: 'en' }),
        year: this.chance.integer({ min: 1970, max: 2024 }),
        color: this.chance.color({format: 'hex'})
      }
    });
    this.virtualCars = Array.from({ length: 1000 });
  }
}
