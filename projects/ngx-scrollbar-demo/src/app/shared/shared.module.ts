import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatInputModule,
  MatListModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatChipsModule,
  MatIconModule,
  MatCheckboxModule,
  MatSliderModule,
  MatButtonToggleModule
} from '@angular/material';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationToolbarComponent } from './navigation-toolbar/navigation-toolbar.component';
import { LogoComponent } from './logo/logo.component';
import { AuthorComponent } from './author/author.component';

import { NgScrollbarModule } from '../../../../ngx-scrollbar/src/public-api';
import { NgScrollbarReachedModule } from '../../../../ngx-scrollbar/reached-event/src/public_api';

@NgModule({
  imports: [
    CommonModule,
    BidiModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatChipsModule,
    MatSliderModule,
    NgScrollbarModule,
    MatButtonToggleModule,
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
    MatSlideToggleModule,
    MatExpansionModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatSliderModule,
    NgScrollbarModule,
    MatButtonToggleModule,
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
