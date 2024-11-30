import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthorComponent } from '../author/author.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthorComponent]
})
export class FooterComponent {
}
