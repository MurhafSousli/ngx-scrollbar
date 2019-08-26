import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-reached-notifier',
  template: `
    <span class="reached-event-title">Reached events</span>
    <mat-chip-list style="margin-bottom: .5em">
      <mat-chip color="danger" [class.changed]="reached.top">
        <span>Top</span>
      </mat-chip>
      <mat-chip color="danger" [class.changed]="reached.bottom">
        <span>Bottom</span>
      </mat-chip>
    </mat-chip-list>

    <mat-chip-list>
      <mat-chip color="danger" [class.changed]="reached.start">
        <span>Start</span>
      </mat-chip>
      <mat-chip color="danger" [class.changed]="reached.end">
        <span>End</span>
      </mat-chip>
    </mat-chip-list>
  `,
  styleUrls: ['./reached-notifier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReachedNotifierComponent {
  @Input() reached: ReachedEvent;
}

export interface ReachedEvent {
  top?: boolean;
  bottom?: boolean;
  start?: boolean;
  end?: boolean;
}
