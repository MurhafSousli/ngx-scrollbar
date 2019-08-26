import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';
import { take, tap, delay } from 'rxjs/operators';
import {
  ScrollbarAppearance,
  ScrollbarTrack,
  ScrollbarPosition,
  ScrollbarVisibility
} from '../../../../ngx-scrollbar/src/public-api';
// import {
//   ScrollbarAppearance,
//   ScrollbarTrack,
//   ScrollbarPosition,
//   ScrollbarVisibility
// } from 'ngx-scrollbar';
import { ResizeChange } from './resize-form/resize-form.component';
import { ToggleChange } from './toggle-form/toggle-form.component';
import { ReachedEvent } from './reached-notifier/reached-notifier.component';

@Component({
  selector: 'app-example-x',
  templateUrl: './example-x.component.html',
  styleUrls: ['./example-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-component]': 'true'
  }
})
export class ExampleXComponent {

  // Testing options
  slider: ResizeChange = {
    componentSize: 100,
    contentWidth: 100,
    contentSize: 4
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
      tap(() => this.reached.next({ ...this.reached.value, [eventName]: false }))
    ).subscribe();
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
    borderRadius: '--scrollbar-border-radius'
  };

  constructor(private variables: NgScrollbarCssVariables) {
  }

  get value(): string {
    return Object.keys(this.variables)
      .map((key: string) => `${ [this.keyValues[key]] }: ${ this.variables[key] }`)
      .join(';');
  }
}
