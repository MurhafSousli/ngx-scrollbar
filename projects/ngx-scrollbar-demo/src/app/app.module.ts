import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { ColorPickerModule } from './color-picker';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { Example2Component } from './example2/example2.component';
import { Example3Component } from './example3/example3.component';
import { Example4Component } from './example4/example4.component';
import { Example5Component } from './example5/example5.component';
import { ExampleXComponent } from './example-x/example-x.component';
import { CssVariablesFormComponent } from './example-x/css-variables-form/css-variables-form.component';
import { ExampleVirtualScrollComponent } from './example-virutal-scroll/example-virtual-scroll.component';
import { ExampleInfiniteScrollComponent } from './example-infinite-scroll/example-infinite-scroll.component';
import { ExampleNestedVirtualScrollComponent } from './example-nested-virtual-scroll/example-nested-virtual-scroll.component';
import { CardComponent } from './example-nested-virtual-scroll/card/card.component';
import { ResizeFormComponent } from './example-x/resize-form/resize-form.component';
import { ToggleFormComponent } from './example-x/toggle-form/toggle-form.component';
import { ReachedNotifierComponent } from './example-x/reached-notifier/reached-notifier.component';
import { SmoothScrollFormComponent } from './example-x/smooth-scroll-form/smooth-scroll-form.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { ExampleScrolltoElementComponent } from './example-scrollto-element/example-scrollto-element.component';

@NgModule({
  declarations: [
    AppComponent,
    Example2Component,
    Example3Component,
    Example4Component,
    Example5Component,
    ExampleXComponent,
    CssVariablesFormComponent,
    ExampleVirtualScrollComponent,
    ExampleInfiniteScrollComponent,
    ExampleNestedVirtualScrollComponent,
    ExampleScrolltoElementComponent,
    CardComponent,
    ResizeFormComponent,
    ToggleFormComponent,
    ReachedNotifierComponent,
    SmoothScrollFormComponent,
    SponsorsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ColorPickerModule,
    ScrollingModule,
    BrowserAnimationsModule,
    InfiniteScrollModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
