import { NgModule } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { NgScrollbarModule } from 'ngx-scrollbar';
// Uncomment the following line in development mode
// import { NgScrollbarModule } from '../../src/public-api';
import {
  NgScrollbarReachedTop,
  NgScrollbarReachedBottom,
  NgScrollbarReachedStart,
  NgScrollbarReachedEnd
} from './ng-scrollbar-reached';

@NgModule({
  imports: [
    NgScrollbarModule,
    BidiModule
  ],
  declarations: [
    NgScrollbarReachedTop,
    NgScrollbarReachedBottom,
    NgScrollbarReachedStart,
    NgScrollbarReachedEnd
  ],
  exports: [
    NgScrollbarReachedTop,
    NgScrollbarReachedBottom,
    NgScrollbarReachedStart,
    NgScrollbarReachedEnd
  ]
})
export class NgScrollbarReachedModule {
}
