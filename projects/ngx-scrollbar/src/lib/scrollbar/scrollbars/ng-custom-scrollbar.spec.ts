import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';

import { NgCustomScrollbar } from './ng-custom-scrollbar';
import { NgScrollbar } from '../ng-scrollbar';
import { ScrollView } from '../scroll-view';
import { SmoothScrollManager } from '../../smooth-scroll/smooth-scroll-manager';
import { VerticalScrollbar } from './classes/vertical-scrollbar';
import { HorizontalScrollbar } from './classes/horizontal-scrollbar';

describe('Internal Scrollbar Component', () => {
  let component: NgCustomScrollbar;
  let fixture: ComponentFixture<NgCustomScrollbar>;
  let componentElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ObserversModule,
        LayoutModule,
        BidiModule
      ],
      declarations: [
        NgScrollbar,
        NgCustomScrollbar,
        ScrollView
      ],
      providers: [
        SmoothScrollManager,
        ChangeDetectorRef,
        {provide: NgScrollbar, useClass: NgScrollbar}
      ]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(NgCustomScrollbar);
    component = fixture.componentInstance;
    componentElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.parent instanceof NgScrollbar).toBeTruthy();
  });

  it('should use vertical axis', () => {
    component.axis = 'vertical';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.customScrollbar instanceof VerticalScrollbar).toBeTruthy();
  });

  it('should use horizontal axis', () => {
    component.axis = 'horizontal';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.customScrollbar instanceof HorizontalScrollbar).toBeTruthy();
  });
});
