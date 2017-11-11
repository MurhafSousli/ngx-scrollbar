import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { ScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ngx-scrollbar-demo-id'}),
    SharedModule,
    ScrollbarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
