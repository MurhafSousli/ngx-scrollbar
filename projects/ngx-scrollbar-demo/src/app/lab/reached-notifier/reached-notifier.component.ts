import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-reached-notifier',
  template: `
    <div class="notifier-wrapper">
      <div>Reached</div>
      <mat-chip-set class="reached">
        <mat-chip [class.changed]="reached.top">
          Top
        </mat-chip>
        <mat-chip [class.changed]="reached.bottom">
          Bottom
        </mat-chip>
        <mat-chip [class.changed]="reached.start">
          Start
        </mat-chip>
        <mat-chip [class.changed]="reached.end">
          End
        </mat-chip>
      </mat-chip-set>
    </div>

   <div class="notifier-wrapper">
     <div>Dropped</div>
     <mat-chip-set class="dropped">
       <mat-chip [class.changed]="dropped.top">
         Top
       </mat-chip>
       <mat-chip [class.changed]="dropped.bottom">
         Bottom
       </mat-chip>
       <mat-chip [class.changed]="dropped.start">
         Start
       </mat-chip>
       <mat-chip [class.changed]="dropped.end">
         End
       </mat-chip>
     </mat-chip-set>
   </div>
  `,
  styleUrls: ['./reached-notifier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatChipsModule]
})
export class ReachedNotifierComponent {
  @Input() reached: ReachedEvent;
  @Input() dropped: ReachedEvent;
}

export interface ReachedEvent {
  top?: boolean;
  bottom?: boolean;
  start?: boolean;
  end?: boolean;
}
