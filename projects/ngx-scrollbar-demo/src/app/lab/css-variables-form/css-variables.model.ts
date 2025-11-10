export interface CssVariablesModel<T> {
  containerColor: T,
  containerOffset: T,
  containerShape: T,
  trackOffset: T,
  trackShape: T,
  trackThickness: T,
  trackHoverThickness: T,
  trackActiveThickness: T,
  trackColor: T,
  thumbShape: T,
  thumbSize: T,
  thumbMinSize: T,
  thumbColor: T,
  thumbHoverColor: T,
  thumbActiveColor: T,
  overscrollBehavior: T,
  hoverOpacityTransitionLeaveDuration: T,
  hoverOpacityTransitionLeaveDelay: T,
  buttonShape: T,
  buttonColor: T,
  buttonHoverColor: T,
  buttonActiveColor: T,
  buttonInactiveColor: T,
  buttonFill: T,
  buttonHoverFill: T,
  buttonActiveFill: T,
  buttonInactiveFill: T,
}

export type CssVariablesDict<T> = Partial<CssVariablesModel<T>>;

export type CssVariablesControl = CssVariablesModel<{ controlType: string, defaultValue: string }>;

export const CSS_VARIABLES: CssVariablesControl = {
  containerColor: {
    controlType: 'color',
    defaultValue: ''
  },
  containerOffset: {
    controlType: 'string',
    defaultValue: ''
  },
  containerShape: {
    controlType: 'string',
    defaultValue: ''
  },
  trackOffset: {
    controlType: 'string',
    defaultValue: '3px'
  },
  trackShape: {
    controlType: 'string',
    defaultValue: ''
  },
  trackThickness: {
    controlType: 'string',
    defaultValue: '12px'
  },
  trackHoverThickness: {
    controlType: 'string',
    defaultValue: '15px'
  },
  trackActiveThickness: {
    controlType: 'string',
    defaultValue: '15px'
  },
  trackColor: {
    controlType: 'color',
    defaultValue: '#5b4130'
  },
  thumbShape: {
    controlType: 'string',
    defaultValue: ''
  },
  thumbSize: {
    controlType: 'string',
    defaultValue: ''
  },
  thumbMinSize: {
    controlType: 'string',
    defaultValue: ''
  },
  thumbColor: {
    controlType: 'color',
    defaultValue: 'var(--color-primary)'
  },
  thumbHoverColor: {
    controlType: 'color',
    defaultValue: 'var(--color-active-link)'
  },
  thumbActiveColor: {
    controlType: 'color',
    defaultValue: 'var(--color-active-link)'
  },
  overscrollBehavior: {
    controlType: 'string',
    defaultValue: 'initial'
  },
  hoverOpacityTransitionLeaveDuration: {
    controlType: 'string',
    defaultValue: '400ms'
  },
  hoverOpacityTransitionLeaveDelay: {
    controlType: 'string',
    defaultValue: '800ms'
  },
  buttonShape: {
    controlType: 'string',
    defaultValue: ''
  },
  buttonColor: {
    controlType: 'color',
    defaultValue: ''
  },
  buttonHoverColor: {
    controlType: 'color',
    defaultValue: ''
  },
  buttonActiveColor: {
    controlType: 'color',
    defaultValue: ''
  },
  buttonInactiveColor: {
    controlType: 'color',
    defaultValue: ''
  },
  buttonFill: {
    controlType: 'color',
    defaultValue: ''
  },
  buttonHoverFill: {
    controlType: 'color',
    defaultValue: ''
  },
  buttonActiveFill: {
    controlType: 'color',
    defaultValue: ''
  },
  buttonInactiveFill: {
    controlType: 'color',
    defaultValue: ''
  }
};
