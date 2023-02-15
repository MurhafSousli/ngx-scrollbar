import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-reached-notifier',
  template: `
    <span class="reached-event-title">Reached events</span>
    <mat-chip-set style="margin-bottom: .5em">
      <mat-chip [class.changed]="reached.top">
        Top
      </mat-chip>
      <mat-chip [class.changed]="reached.bottom">
          Bottom
      </mat-chip>
    </mat-chip-set>

    <mat-chip-set>
      <mat-chip [class.changed]="reached.start">
        Start
      </mat-chip>
      <mat-chip [class.changed]="reached.end">
        End
      </mat-chip>
    </mat-chip-set>
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
