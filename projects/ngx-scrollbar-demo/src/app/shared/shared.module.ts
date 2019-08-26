import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatExpansionModule, MatInputModule, MatListModule,
  MatSlideToggleModule, MatTabsModule,
  MatToolbarModule,
  MatChipsModule, MatIconModule, MatCheckboxModule, MatSliderModule
} from '@angular/material';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationToolbarComponent } from './navigation-toolbar/navigation-toolbar.component';
import { LogoComponent } from './logo/logo.component';
import { AuthorComponent } from './author/author.component';

import { NgScrollbarModule } from '../../../../ngx-scrollbar/src/public-api';
import { NgScrollbarReachedModule } from '../../../../ngx-scrollbar/reached-event/src/public_api';

// import { NgScrollbarModule } from 'ngx-scrollbar';
// import { NgScrollbarResizeSensorModule } from 'ngx-scrollbar/resize-sensor';
// import { NgScrollbarContentSensorModule } from 'ngx-scrollbar/content-sensor';
// import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';

@NgModule({
  imports: [
    CommonModule,
    BidiModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatSliderModule,
    NgScrollbarModule,
    NgScrollbarReachedModule
  ],
  exports: [
    BidiModule,
    HeaderComponent,
    FooterComponent,
    NavigationToolbarComponent,
    LogoComponent,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatSliderModule,
    NgScrollbarModule,
    NgScrollbarReachedModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    NavigationToolbarComponent,
    LogoComponent,
    AuthorComponent
  ]
})
export class SharedModule {
}
