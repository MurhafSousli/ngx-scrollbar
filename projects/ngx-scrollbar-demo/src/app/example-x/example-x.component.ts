import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { BidiModule } from '@angular/cdk/bidi';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { of, take, delay, BehaviorSubject, Subject } from 'rxjs';
import {
  NgScrollbar,
  ScrollbarAppearance,
  ScrollbarPointerEventsMethod,
  ScrollbarTrack,
  ScrollbarPosition,
  ScrollbarVisibility,
  NgScrollbarModule
} from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { ResizeChange, ResizeFormComponent } from './resize-form/resize-form.component';
import { ToggleChange, ToggleFormComponent } from './toggle-form/toggle-form.component';
import { ReachedEvent, ReachedNotifierComponent } from './reached-notifier/reached-notifier.component';
import { CssVariablesFormComponent } from './css-variables-form/css-variables-form.component';
import { SmoothScrollFormComponent } from './smooth-scroll-form/smooth-scroll-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LogoComponent } from '../shared/logo/logo.component';

@Component({
  selector: 'app-example-x',
  templateUrl: './example-x.component.html',
  styleUrls: ['./example-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.example-component]': 'true' },
  standalone: true,
  imports: [
    CommonModule,
    BidiModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatDividerModule,
    NgScrollbarModule,
    NgScrollbarReachedModule,
    ResizeFormComponent,
    LogoComponent,
    ToggleFormComponent,
    ReachedNotifierComponent,
    SmoothScrollFormComponent,
    CssVariablesFormComponent,
  ]
})
export class ExampleXComponent {

  @ViewChild(NgScrollbar) scrollable: NgScrollbar;

  pointerEventsMethod: ScrollbarPointerEventsMethod;

  // Testing options
  slider: ResizeChange = {
    componentSize: 100,
    contentWidth: 100,
    contentSize: 5
  };
  toggle: ToggleChange = {
    disabled: false,
    sensorDisabled: false,
    highlight: false,
    rtl: false
  };

  // Dynamic scrollbar options
  compact = false;
  cssVariables: SafeStyle;
  position: ScrollbarPosition = 'native';
  direction: ScrollbarTrack = 'all';
  visibility: ScrollbarVisibility = 'native';
  appearance: ScrollbarAppearance = 'compact';

  reached = new BehaviorSubject<ReachedEvent>({});

  // For smooth scrollToElement test
  scrollToElementSelected = false;
  scrollToReached$: Subject<boolean> = new Subject<boolean>();

  get content() {
    return '<b>Lorem ipsum dolor sit amet</b>' + content.repeat(this.slider.contentSize);
  }

  constructor(private sanitizer: DomSanitizer) {
  }

  setStyle(variables: Partial<NgScrollbarCssVariables>) {
    this.cssVariables = this.sanitizer.bypassSecurityTrustStyle(new CssVariables(variables).value);
  }

  onReached(eventName) {
    this.reached.next({ ...this.reached.value, [eventName]: true });
    of(null).pipe(
      delay(600),
      take(1),
    ).subscribe(() => this.reached.next({ ...this.reached.value, [eventName]: false }));
  }

  onScrollTo(event) {
    // Prepare scrollTo options from event
    const options = {
      [event.axisXProperty]: event.axisXValue,
      [event.axisYProperty]: event.axisYValue,
      duration: event.duration
    };
    // This shows effect on play button when scrollTo has reached
    const onScrollToReached = () => {
      this.scrollToReached$.next(true);
      of(null).pipe(
        delay(600),
        take(1),
      ).subscribe(() => this.scrollToReached$.next(false));
    };

    if (this.scrollToElementSelected) {
      this.scrollable.scrollToElement('#target', options).then(() => onScrollToReached());
    } else {
      this.scrollable.scrollTo(options).then(() => onScrollToReached());
    }
  }

}

const content = `
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet mollitia vero quam, nisi possimus dolorem asperiores, molestiae sit voluptatibus alias consequuntur laudantium repellat ea quidem quaerat rerum perspiciatis iste adipisci. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet mollitia vero quam, nisi possimus dolorem asperiores.</p>
`;

export interface NgScrollbarCssVariables {
  trackColor?: string;
  thumbColor?: string;
  thumbHoverColor?: string;
  size?: string;
  hoverSize?: string;
  trackPadding?: string;
  borderRadius?: string;
}

class CssVariables {
  private readonly keyValues = {
    trackColor: '--scrollbar-track-color',
    thumbColor: '--scrollbar-thumb-color',
    thumbHoverColor: '--scrollbar-thumb-hover-color',
    size: '--scrollbar-size',
    trackPadding: '--scrollbar-padding',
    hoverSize: '--scrollbar-hover-size',
    borderRadius: '--scrollbar-border-radius',
    overscrollBehavior: '--scrollbar-overscroll-behavior',
    transitionDuration: '--scrollbar-transition-duration',
    transitionDelay: '--scrollbar-transition-delay'
  };

  constructor(private variables: NgScrollbarCssVariables) {
  }

  get value(): string {
    return Object.keys(this.variables)
      .map((key: string) => `${ [this.keyValues[key]] }: ${ this.variables[key] }`)
      .join(';');
  }
}
