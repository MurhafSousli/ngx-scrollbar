import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';

// import { NgScrollbarModule, NgScrollbarReachedModule } from 'ngx-scrollbar';
import { NgScrollbarModule, NgScrollbarReachedModule } from '../../projects/ngx-scrollbar/src/public-api';
import { ColorPickerModule } from './color-picker';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { Example1Component } from './example1/example1.component';
import { Example2Component } from './example2/example2.component';
import { Example3Component } from './example3/example3.component';
import { Example4Component } from './example4/example4.component';
import { Example5Component } from './example5/example5.component';
import { ExampleXComponent } from './example-x/example-x.component';
import { CssVariablesFormComponent } from './example-x/css-variables-form/css-variables-form.component';
import { ExampleVirtualScrollComponent } from './example-virutal-scroll/example-virtual-scroll.component';
import { ExampleImageComponent } from './example-image/example-image.component';
import { ExampleInfiniteScrollComponent } from './example-infinite-scroll/example-infinite-scroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ExampleNestedVirtualScrollComponent } from './example-nested-virtual-scroll/example-nested-virtual-scroll.component';
import { CardComponent } from './example-nested-virtual-scroll/card/card.component';

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
    ExampleVirtualScrollComponent,
    ExampleImageComponent,
    ExampleInfiniteScrollComponent,
    ExampleNestedVirtualScrollComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgScrollbarModule,
    NgScrollbarReachedModule,
    ColorPickerModule,
    ScrollingModule,
    BrowserAnimationsModule,
    InfiniteScrollModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
