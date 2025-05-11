import { Component, inject, signal, ViewChild, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NgScrollbar,
  ViewportAdapter,
  ScrollbarPosition,
  ScrollbarVisibility,
  ScrollbarAppearance,
  ScrollbarOrientation
} from 'ngx-scrollbar';
// import { NgScrollDropped, NgScrollReached } from 'ngx-scrollbar/reached-event';
import { NzResizableModule, NzResizeDirection, NzResizeEvent } from 'ng-zorro-antd/resizable';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { LogoComponent } from '../shared/logo/logo.component';
import { ResizeChange, ResizeFormComponent } from './resize-form/resize-form.component';
import { ToggleChange } from './toggle-form/toggle-form.component';
import { ReachedEvent, ReachedNotifierComponent } from './reached-notifier/reached-notifier.component';
import { CssVariablesFormComponent } from './css-variables-form/css-variables-form.component';
import { SmoothScrollFormComponent, SmoothScrollOptionsForm } from './smooth-scroll-form/smooth-scroll-form.component';

@Component({
  selector: 'app-lab',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbar,
    // NgScrollReached,
    // NgScrollDropped,
    MatCardModule,
    MatButtonToggleModule,
    MatExpansionModule,
    NzResizableModule,
    NzIconModule,
    LogoComponent,
    CssVariablesFormComponent,
    SmoothScrollFormComponent,
    ResizeFormComponent,
    ReachedNotifierComponent
  ],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabComponent {

  private sanitizer: DomSanitizer = inject(DomSanitizer);

  @ViewChild(ViewportAdapter, { static: true }) component: ViewportAdapter;

  stylingPanelExpanded: boolean;

  direction: 'ltr' | 'rtl' = 'ltr';
  buttons: boolean = true;
  hoverOffset: boolean = false;
  interactionDisabled: boolean = false;
  disableSensor: boolean = false;
  disableReached: boolean = false;
  disableDropped: boolean = false;
  sensorThrottleTime: number = 0;
  trackScrollDuration: number = 50;

  // Testing options
  slider: ResizeChange = {
    componentSize: 100,
    contentWidth: 1,
    contentSize: 5
  };
  toggle: ToggleChange = {
    disableReached: false,
    disableSensor: false,
    highlight: false,
    rtl: false
  };

  // Dynamic scrollbar options
  compact: boolean = false;
  variables: Partial<NgScrollbarCssVariables>
  cssVariables: SafeStyle;
  position: ScrollbarPosition = 'native';
  orientation: ScrollbarOrientation = 'auto';
  visibility: ScrollbarVisibility = 'native';
  appearance: ScrollbarAppearance = 'native';

  // For smooth scrollToElement test
  scrollToElementSelected: boolean = false;

  reached: WritableSignal<ReachedEvent> = signal({});

  dropped: WritableSignal<ReachedEvent> = signal({});

  scrollReached: WritableSignal<any> = signal(false);

  get content(): string {
    return '<b>Lorem ipsum dolor sit amet</b>' + content.repeat(this.slider.contentSize);
  }

  width: number = 448;
  height: number = 300;
  id: number = -1;
  resizeDirection: NzResizeDirection | null = null;

  onResize({ width, height, direction }: NzResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.width = width;
      this.height = height;
      this.resizeDirection = direction;
    });
  }

  setStyle(variables: Partial<NgScrollbarCssVariables>): void {
    this.variables = variables;
    this.cssVariables = this.sanitizer.bypassSecurityTrustStyle(new CssVariables(variables).value);
  }

  onReached(eventName: string): void {
    this.reached.set({ [eventName]: true });
    setTimeout(() => {
      this.reached.set({ [eventName]: false })
    }, 600);
  }

  onDropped(eventName: string): void {
    this.dropped.set({ [eventName]: true });
    setTimeout(() => {
      this.dropped.set({ [eventName]: false })
    }, 600);
  }

  onScrollTo(event: SmoothScrollOptionsForm): void {
    // Prepare scrollTo options from event
    const options: Partial<SmoothScrollOptionsForm> = {
      [event.axisXProperty]: event.axisXValue,
      [event.axisYProperty]: event.axisYValue,
      center: event.center,
      duration: event.duration
    };
    // This shows effect on play button when scrollTo has reached
    const onScrollToReached = () => {
      this.scrollReached.set(true);
      setTimeout(() => this.scrollReached.set(false), 600);
    };

    if (this.scrollToElementSelected) {
      const target: HTMLElement = document.querySelector('#target');
      this.component.scrollToElement(target, options).then(() => onScrollToReached());
    } else {
      this.component.scrollTo(options).then(() => onScrollToReached());
    }
  }

  onExpandedChange(expanded: boolean): void {
    if (!expanded) {
      this.stylingPanelExpanded = false;
    }
  }
}

const content: string = `
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet mollitia vero quam, nisi possimus dolorem asperiores, molestiae sit voluptatibus alias consequuntur laudantium repellat ea quidem quaerat rerum perspiciatis iste adipisci. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet mollitia vero quam, nisi possimus dolorem asperiores.</p>
`;

export interface NgScrollbarCssVariables {
  trackColor?: string;
  thumbColor?: string;
  thumbHoverColor?: string;
  thickness?: string;
  hoverThickness?: string;
  trackOffset?: string;
  borderRadius?: string;
}

class CssVariables {
  private readonly keyValues = {
    trackColor: '--scrollbar-track-color',
    thumbColor: '--scrollbar-thumb-color',
    thumbHoverColor: '--scrollbar-thumb-hover-color',
    thickness: '--scrollbar-thickness',
    trackOffset: '--scrollbar-offset',
    hoverThickness: '--scrollbar-hover-thickness',
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
