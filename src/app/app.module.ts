import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ScrollingModule} from '@angular/cdk/scrolling';
// import {NgScrollbarModule} from 'ngx-scrollbar';
import {NgScrollbarModule} from '../../projects/ngx-scrollbar/src/public_api';
import {ColorPickerModule} from './color-picker';
import {SharedModule} from './shared/shared.module';

import {AppComponent} from './app.component';
import {Example1Component} from './example1/example1.component';
import {Example2Component} from './example2/example2.component';
import {Example3Component} from './example3/example3.component';
import {Example4Component} from './example4/example4.component';
import {Example5Component} from './example5/example5.component';
import {ExampleXComponent} from './example-x/example-x.component';
import {CssVariablesFormComponent} from './example-x/css-variables-form/css-variables-form.component';
import {ExampleVirtualScrollComponent} from './example-virutal-scroll/example-virtual-scroll.component';

@NgModule({
  declarations: [
    AppComponent,
    Example1Component,
    Example2Component,
    Example3Component,
    Example4Component,
    Example5Component,
    ExampleXComponent,
    CssVariablesFormComponent,
    ExampleVirtualScrollComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgScrollbarModule,
    ColorPickerModule,
    ScrollingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
