import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss']
})
export class ContentWrapperComponent implements OnInit {

  @Input()
  public component: string;

  constructor() { }

  ngOnInit() {
  }

}
