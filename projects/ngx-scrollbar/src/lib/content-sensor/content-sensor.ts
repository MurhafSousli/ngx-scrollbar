import { NgModule, Directive, Optional, AfterContentInit, OnDestroy, NgZone } from '@angular/core';
import { ContentObserver, ObserversModule } from '@angular/cdk/observers';
import { Subscription } from 'rxjs';
import { NgScrollbar } from '../scrollbar/ng-scrollbar';

@Directive({
  selector: '[content-sensor], [contentSensor]'
})
export class ContentSensor implements AfterContentInit, OnDestroy {

  subscription = Subscription.EMPTY;

  constructor(private ngZone: NgZone,
              private contentObserver: ContentObserver,
              @Optional() private scrollbar: NgScrollbar) {
    if (!scrollbar) {
      throw new Error('[NgScrollbar Content Sensor Directive]: Host element must be an NgScrollbar component.');
    }
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() =>
      this.subscription = this.contentObserver.observe(this.scrollbar.view).subscribe(() => this.scrollbar.update())
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

@NgModule({
  imports: [ObserversModule],
  declarations: [ContentSensor],
  exports: [ContentSensor]
})
export class ContentSensorModule {
}
