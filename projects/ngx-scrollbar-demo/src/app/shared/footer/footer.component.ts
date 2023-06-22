import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthorComponent } from '../author/author.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthorComponent]
})
export class FooterComponent {
}
