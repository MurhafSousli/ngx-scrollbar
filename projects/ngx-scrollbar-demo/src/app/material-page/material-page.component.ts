import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExampleVirtualScrollComponent } from '../example-virutal-scroll/example-virtual-scroll.component';
import { ExampleMatSelectComponent } from '../example-mat-select/example-mat-select.component';
import {
  ExampleNestedVirtualScrollComponent
} from '../example-nested-virtual-scroll/example-nested-virtual-scroll.component';

@Component({
  selector: 'app-material-page',
  templateUrl: './material-page.component.html',
  styleUrl: './material-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ExampleNestedVirtualScrollComponent,
    ExampleVirtualScrollComponent,
    ExampleMatSelectComponent
  ],
})
export class MaterialPageComponent {
}
