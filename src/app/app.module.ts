import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { Example1Component } from './example1/example1.component';
import { Example2Component } from './example2/example2.component';
import { Example3Component } from './example3/example3.component';
import { Example4Component } from './example4/example4.component';
import { Example5Component } from './example5/example5.component';

@NgModule({
  declarations: [
    AppComponent,
    Example1Component,
    Example2Component,
    Example3Component,
    Example4Component,
    Example5Component
  ],
  imports: [
    BrowserModule,
    SharedModule,
    ScrollbarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
