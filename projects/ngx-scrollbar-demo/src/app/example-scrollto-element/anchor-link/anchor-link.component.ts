import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnchor } from '../scroll-anchor.directive';

@Component({
  standalone: true,
  selector: 'anchor-link',
  templateUrl: './anchor-link.component.html',
  styleUrl: './anchor-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class AnchorLinkComponent {
  @Input() links: ScrollAnchor[];
  @Input() activeLinkId: string;
}
