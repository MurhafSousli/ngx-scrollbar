import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { NgScrollbarExt, AsyncDetection } from 'ngx-scrollbar';
import { Chance } from 'chance';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

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

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-prime-ng-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    NgScrollbarExt,
    AsyncDetection,
    MatCardModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './prime-ng.component.html',
  styleUrl: './prime-ng.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimeNgComponent implements OnInit {

  chance = new Chance();

  cars: Car[];

  virtualCars: Car[];

  cols: Column[];

  selectedCity: City = { name: 'Damascus', code: 'DMS' };

  cities: City[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Damascus', code: 'DMS' }
  ];

  selectedCar: Car;

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
