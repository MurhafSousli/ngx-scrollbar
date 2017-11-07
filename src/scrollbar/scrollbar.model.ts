export interface ScrollBarState {
  thumbXStyle?: any;
  thumbYStyle?: any;
  viewStyle?: any;
  scrollTop?: number;
  scrollLeft?: number;
}

export interface ScrollBarEvent {
  e: MouseEvent;
  axis: string;
}
