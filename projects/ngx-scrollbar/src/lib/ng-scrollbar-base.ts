import { Directive } from '@angular/core';
import { SmoothScrollToOptions } from 'ngx-scrollbar/smooth-scroll';
import { Observable } from 'rxjs';
import { ScrollViewport } from './scroll-viewport';
import { ScrollbarManager } from './utils/scrollbar-manager';
import { ScrollbarPointerEventsMethod } from './ng-scrollbar.model';

@Directive()
export abstract class NgScrollbarBase {
  abstract manager: ScrollbarManager;

  abstract viewport: ScrollViewport;
  abstract trackClass: string;
  abstract thumbClass: string;
  abstract minThumbSize: number;
  abstract viewportPropagateMouseMove: boolean;
  abstract trackClickScrollDuration: number;
  abstract pointerEventsMethod: ScrollbarPointerEventsMethod;
  abstract pointerEventsDisabled: boolean;

  abstract updated: Observable<void>;
  abstract scrolled: Observable<any>;

  abstract setHovered(hovered: ScrollbarHovered);

  abstract setDragging(hovered: ScrollbarDragging);

  abstract setClicked(scrollbarClicked: boolean);

  abstract scrollTo(options: SmoothScrollToOptions): Promise<void>;
}

export interface ScrollbarDragging {
  verticalDragging?: boolean;
  horizontalDragging?: boolean;
}

export interface ScrollbarHovered {
  verticalHovered?: boolean;
  horizontalHovered?: boolean;
}
