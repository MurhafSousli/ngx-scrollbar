import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgScrollbarMatDialog } from 'ngx-scrollbar/mat';

@Component({
  selector: 'app-example-mat-dialog',
  templateUrl: './example-mat-dialog.component.html',
  styleUrl: './example-mat-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, NgScrollbar, NgScrollbarMatDialog]
})
export class ExampleMatDialogComponent {
}
