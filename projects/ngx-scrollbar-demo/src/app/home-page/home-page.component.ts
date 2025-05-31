import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { MatButton } from '@angular/material/button';
import { ScrollbarDocument } from 'ngx-scrollbar';
import { NgScrollReachDrop } from 'ngx-scrollbar/reached-event';
import { Example2Component } from '../example2/example2.component';
import { Example3Component } from '../example3/example3.component';
import { Example5Component } from '../example5/example5.component';
import { LabComponent } from '../lab/lab.component';
import { HeaderComponent } from '../shared/header/header.component';
import { NgScrollbarAsyncViewport, NgScrollbar, NgScrollbarExt, NgScrollbarAnywhere, ScrollbarRef } from 'ngx-scrollbar';

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
    NgScrollbarAsyncViewport,
    NgScrollReachDrop,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  externalViewport = '.my-custom-viewport';
  externalContentWrapper = '.my-custom-content-wrapper';
  externalSpacer = '.my-custom-spacer';

  show = false;

  readonly platform: Platform = inject(Platform);

  readonly anyWhere = inject(NgScrollbarAnywhere);
  readonly scrollbarDocument = inject(ScrollbarDocument);

  flag = false;
  reachedDisabled = false;
  scrollbarRef: ScrollbarRef<NgScrollbar>;

  x(t: NgScrollbarExt) {
    console.log('🤖', t);
  }

  log(e) {
    console.log('🐴', e);
  }

  test() {
    if (this.flag) {
      this.flag = false;
      this.scrollbarRef?.destroy();
      return;
    }

    this.flag = true;

    requestAnimationFrame(() => {
      this.scrollbarRef = this.anyWhere.createScrollbar('#test');
    });
    // requestAnimationFrame(() => {
    //   this.scrollbarDocument.attachScrollbar();
    // });

    // requestAnimationFrame(() => {
    //   this.anyWhere.createScrollbar({
    //     host: '#test',
    //     viewport: '.viewport'
    //   });
    // })
  }
}
