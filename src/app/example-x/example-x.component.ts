import { ChangeDetectionStrategy, Component, NgZone } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Subject, of } from 'rxjs';
import { take, tap, delay } from 'rxjs/operators';
// import { NgScrollbarAppearance, NgScrollbarDirection, NgScrollbarVisibility } from 'ngx-scrollbar';
import {
  NgScrollbarAppearance,
  NgScrollbarDirection,
  NgScrollbarPosition,
  NgScrollbarVisibility
} from '../../../projects/ngx-scrollbar/src/public-api';

@Component({
  selector: 'app-example-x',
  templateUrl: './example-x.component.html',
  styleUrls: ['./example-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleXComponent {
  compact = false;
  cssVariables: SafeStyle;
  position: NgScrollbarPosition = 'native';
  direction: NgScrollbarDirection = 'all';
  visibility: NgScrollbarVisibility = 'native';
  appearance: NgScrollbarAppearance = 'standard';
  content = content;

  // Display reached output name
  reachedTop$ = new Subject();
  reachedBottom$ = new Subject();
  reachedLeft$ = new Subject();
  reachedRight$ = new Subject();

  constructor(private _sanitizer: DomSanitizer, private ngZone: NgZone) {
  }

  resized(e) {
    // console.log(e, 'isInAngularZone', NgZone.isInAngularZone());
  }

  setStyle(variables: Partial<NgScrollbarCssVariables>) {
    this.cssVariables = this._sanitizer.bypassSecurityTrustStyle(new CssVariables(variables).value);
  }

  reachedTop() {
    this.reachedTop$.next(true);
    of(null).pipe(
      delay(600),
      take(1),
      tap(() => this.reachedTop$.next(false))
    ).subscribe();
  }

  reachedBottom() {
    this.reachedBottom$.next(true);
    of(null).pipe(
      delay(600),
      take(1),
      tap(() => this.reachedBottom$.next(false))
    ).subscribe();
  }

  reachedLeft() {
    this.reachedLeft$.next(true);
    of(null).pipe(
      delay(600),
      take(1),
      tap(() => this.reachedLeft$.next(false))
    ).subscribe();
  }

  reachedRight() {
    this.reachedRight$.next(true);
    of(null).pipe(
      delay(600),
      take(1),
      tap(() => this.reachedRight$.next(false))
    ).subscribe();
  }
}

const content = `<b>Lorem ipsum dolor sit amet</b>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet mollitia vero quam, nisi possimus dolorem asperiores, molestiae sit voluptatibus alias consequuntur laudantium repellat ea quidem quaerat rerum perspiciatis iste adipisci.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore maiores maxime corrupti quisquam. Dignissimos sunt error voluptatibus repellat consequatur illo, aliquid nihil maxime veniam repudiandae, provident et sit, reiciendis dicta.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae id amet deserunt voluptate maiores sunt aut eligendi totam nesciunt magnam illo consectetur aspernatur at voluptatem, qui unde ullam omnis voluptates.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id assumenda et fugiat placeat enim quas, voluptas odio aperiam in quibusdam beatae eaque minima. Consequuntur pariatur, doloremque, odit dolorem ullam sunt!</p>`;

export interface NgScrollbarCssVariables {
  color: string;
  viewColor: string;
  thumbColor: string;
  thumbHoverColor: string;
  containerColor: string;
  size: string;
  viewMargin: string;
  padding: string;
  borderRadius: string;
}

class CssVariables {
  private readonly _keyValues = {
    color: '--scrollbar-color',
    viewColor: '--scroll-view-color',
    thumbColor: '--scrollbar-thumb-color',
    thumbHoverColor: '--scrollbar-thumb-hover-color',
    containerColor: '--scrollbar-container-color',
    size: '--scrollbar-size',
    padding: '--scrollbar-padding',
    viewMargin: '--scroll-view-margin',
    borderRadius: '--scrollbar-border-radius'
  };

  constructor(private _variables: Partial<NgScrollbarCssVariables>) {
  }

  get value(): string {
    return Object.keys(this._variables)
      .map((key: string) => `${[this._keyValues[key]]}: ${this._variables[key]}`)
      .join(';');
  }
}
