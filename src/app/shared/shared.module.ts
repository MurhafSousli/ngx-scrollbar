import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationToolbarComponent } from './navigation-toolbar/navigation-toolbar.component';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatExpansionModule, MatInputModule, MatListModule,
  MatSlideToggleModule, MatTabsModule,
  MatToolbarModule,
  MatChipsModule, MatIconModule
} from '@angular/material';
import { LogoComponent } from './logo/logo.component';
import { AuthorComponent } from './author/author.component';
import { ResizeSensorModule } from '../../../projects/ngx-scrollbar/src/lib/resize-sensor/resize-sensor.module';
import { NgScrollbarModule } from '../../../projects/ngx-scrollbar/src/lib/scrollbar/ng-scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
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
    ResizeSensorModule,
    NgScrollbarModule
  ],
  exports: [
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
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    ResizeSensorModule
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
