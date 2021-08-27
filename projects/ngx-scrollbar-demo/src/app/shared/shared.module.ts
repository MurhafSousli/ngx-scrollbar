import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';

import { ColorPickerModule } from '../color-picker';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationToolbarComponent } from './navigation-toolbar/navigation-toolbar.component';
import { LogoComponent } from './logo/logo.component';
import { AuthorComponent } from './author/author.component';

@NgModule({
  imports: [
    CommonModule,
    BidiModule,
    ScrollingModule,
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
    MatIconModule,
    MatButtonToggleModule,
    InfiniteScrollModule,
    NgScrollbarModule,
    NgScrollbarReachedModule,
    ColorPickerModule
  ],
  exports: [
    BidiModule,
    InfiniteScrollModule,
    ScrollingModule,
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
    MatChipsModule,
    MatIconModule,
    MatSliderModule,
    NgScrollbarModule,
    MatButtonToggleModule,
    NgScrollbarReachedModule,
    ColorPickerModule
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
