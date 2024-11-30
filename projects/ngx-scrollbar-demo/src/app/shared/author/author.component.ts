import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorComponent {
}
