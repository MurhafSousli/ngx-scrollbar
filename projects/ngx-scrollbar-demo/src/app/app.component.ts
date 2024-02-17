import { Component, inject, signal, WritableSignal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { FooterComponent } from './shared/footer/footer.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { HeaderComponent } from './shared/header/header.component';
import { LogoComponent } from './shared/logo/logo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgScrollbarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    HeaderComponent,
    FooterComponent,
    SponsorsComponent,
    LogoComponent
  ]
})
export class AppComponent implements OnInit {

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  breakpointState: WritableSignal<{ isHandset: boolean }> = signal({ isHandset: false });

  ngOnInit(): void {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe((result: BreakpointState) => this.breakpointState.set({ isHandset: result.matches }));
  }
}
