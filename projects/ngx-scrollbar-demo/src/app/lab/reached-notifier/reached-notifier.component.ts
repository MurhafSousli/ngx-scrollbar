import { Component, ChangeDetectionStrategy, InputSignal, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-reached-notifier',
  templateUrl: './reached-notifier.component.html',
  styleUrl: './reached-notifier.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipsModule]
})
export class ReachedNotifierComponent {
  reached: InputSignal<ReachedEvent> = input();
  dropped: InputSignal<ReachedEvent> = input();
}

export interface ReachedEvent {
  top?: boolean;
  bottom?: boolean;
  start?: boolean;
  end?: boolean;
}
