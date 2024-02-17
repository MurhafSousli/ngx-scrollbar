import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { NgScrollbar } from 'ngx-scrollbar';
import { Example2Component } from '../example2/example2.component';
import { Example3Component } from '../example3/example3.component';
import { Example5Component } from '../example5/example5.component';
import { ExampleInfiniteScrollComponent } from '../example-infinite-scroll/example-infinite-scroll.component';
import { LabComponent } from '../lab/lab.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true,
  imports: [
    Example2Component,
    Example3Component,
    Example5Component,
    ExampleInfiniteScrollComponent,
    LabComponent,
    HeaderComponent,
    NgScrollbar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readonly platform: Platform = inject(Platform);
}
