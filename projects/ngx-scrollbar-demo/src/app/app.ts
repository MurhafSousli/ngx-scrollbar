import {
  Component,
  inject,
  signal,
  OnInit,
  WritableSignal,
  ChangeDetectionStrategy
} from '@angular/core';
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
import { LogoComponent } from './shared/logo/logo.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NgScrollbarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    FooterComponent,
    SponsorsComponent,
    LogoComponent
  ]
})
export class App implements OnInit {

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  breakpointState: WritableSignal<{ isHandset: boolean }> = signal({ isHandset: false });

  ngOnInit(): void {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe((result: BreakpointState) => this.breakpointState.set({ isHandset: result.matches }));
  }
}
