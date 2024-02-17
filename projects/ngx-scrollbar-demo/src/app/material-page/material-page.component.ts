import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExampleInfiniteScrollComponent } from '../example-infinite-scroll/example-infinite-scroll.component';
import {
  ExampleNestedVirtualScrollComponent
} from '../example-nested-virtual-scroll/example-nested-virtual-scroll.component';
import { ExampleVirtualScrollComponent } from '../example-virutal-scroll/example-virtual-scroll.component';
import { Example5Component } from '../example5/example5.component';
import { ExampleMatSelectComponent } from '../example-mat-select/example-mat-select.component';

@Component({
  selector: 'app-material-page',
  standalone: true,
  imports: [
    ExampleInfiniteScrollComponent,
    ExampleNestedVirtualScrollComponent,
    ExampleVirtualScrollComponent,
    Example5Component,
    ExampleMatSelectComponent
  ],
  templateUrl: './material-page.component.html',
  styleUrl: './material-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialPageComponent {

}
