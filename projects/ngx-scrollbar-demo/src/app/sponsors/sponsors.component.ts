import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrl: './sponsors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SponsorsComponent {
}
