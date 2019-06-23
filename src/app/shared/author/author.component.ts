import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
