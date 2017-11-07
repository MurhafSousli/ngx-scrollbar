import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { AppComponent } from './app.component';
import { ScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Add .withServerTransition() to support Universal rendering.
    // The application ID can be any identifier which is unique on
    // the page.
    BrowserModule.withServerTransition({appId: 'ngx-scrollbar-demo-id'}),
    AppRoutingModule,
    AppSharedModule,
    HomeModule,
    ScrollbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
