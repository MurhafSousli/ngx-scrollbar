import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Example2Component } from '../example2/example2.component';
import { Example3Component } from '../example3/example3.component';
import { Example5Component } from '../example5/example5.component';
import { LabComponent } from '../lab/lab.component';
import { HeaderComponent } from '../shared/header/header.component';
import { MatButton } from '@angular/material/button';
import { NgScrollbar, NgScrollbarExt, ScrollbarAnywhere, ScrollbarRef } from 'ngx-scrollbar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [
    Example2Component,
    Example3Component,
    Example5Component,
    LabComponent,
    HeaderComponent,
    MatButton,
    NgScrollbarExt,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readonly platform: Platform = inject(Platform);

  readonly anyWhere = inject(ScrollbarAnywhere);

  flag = false;
  scrollbarRef: ScrollbarRef<NgScrollbar>;

  test() {
    if (this.flag) {
      this.flag = false;
      this.scrollbarRef?.destroy();
      return;
    }

    this.flag = true;

    requestAnimationFrame(() => {
      this.scrollbarRef = this.anyWhere.createScrollbar('#test');
    })

    // requestAnimationFrame(() => {
    //   this.anyWhere.createScrollbar({
    //     host: '#test',
    //     viewport: '.viewport'
    //   });
    // })
  }
}
