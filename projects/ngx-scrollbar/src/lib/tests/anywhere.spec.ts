import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationRef, Component, inject } from '@angular/core';
import { NgScrollbarAnywhere, NgScrollbar, NgScrollbarExt, ScrollbarRef } from 'ngx-scrollbar';

@Component({
  selector: 'sample-lib',
  template: `
    <div id="target" style="height: 100px">
      <div class="content" style="height: 500px"></div>
    </div>

    <div id="target-x">
      <div id="viewport" style="height: 100px">
        <div id="content" style="height: 500px"></div>
      </div>
    </div>
  `
})
class SampleLibComponent {
  anywhere: NgScrollbarAnywhere = inject(NgScrollbarAnywhere);
  scrollbarRef: ScrollbarRef<NgScrollbar | NgScrollbarExt>;

  createScrollbar(host: string): void {
    this.scrollbarRef = this.anywhere.createScrollbar(host);
  }

  createScrollbarExt(host: string, viewport: string, contentWrapper?: string, spacer?: string): void {
    this.scrollbarRef = this.anywhere.createScrollbarExt({
      host,
      viewport,
      contentWrapper,
      spacer
    });
  }

  destroyScrollbar(): void {
    this.scrollbarRef?.destroy();
  }
}

describe('ScrollbarAnywhere', () => {
  let service: NgScrollbarAnywhere;
  let appRef: ApplicationRef;
  let fixture: ComponentFixture<SampleLibComponent>;
  let component: SampleLibComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleLibComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NgScrollbarAnywhere);
    appRef = TestBed.inject(ApplicationRef);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a scrollbar component when a valid host is provided', () => {
    component.createScrollbar('#target');

    expect(component.scrollbarRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef.instance).toBeInstanceOf(NgScrollbar);
  });

  it('should return null and log error when an invalid host selector is used', () => {
    spyOn(console, 'error');

    component.createScrollbar('#non-existent');

    expect(component.scrollbarRef).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      '[NgScrollbar]: Could not find the host element for selector "#non-existent"'
    );
  });

  it('should properly destroy the scrollbar component', () => {
    component.createScrollbar('#target');

    expect(component.scrollbarRef).toBeTruthy();

    spyOn(component.scrollbarRef, 'destroy').and.callThrough();
    spyOn(component.scrollbarRef.componentRef, 'destroy').and.callThrough();
    spyOn(appRef, 'detachView').and.callThrough();

    component.destroyScrollbar();

    expect(appRef.detachView).toHaveBeenCalledWith(component.scrollbarRef.componentRef.hostView);
    expect(component.scrollbarRef.componentRef.destroy).toHaveBeenCalled();
    expect(component.scrollbarRef.destroy).toHaveBeenCalled();
  });

  it('should create an extended scrollbar component', () => {
    component.createScrollbarExt('#target-x', '#viewport', '#content');

    expect(component.scrollbarRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef.instance).toBeInstanceOf(NgScrollbarExt);
  });

  it('should return null and log error for an invalid extended scrollbar host', () => {
    spyOn(console, 'error');

    component.createScrollbarExt('#non-existent', '#viewport');

    expect(component.scrollbarRef).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      '[NgScrollbar]: Could not find the host element for selector "#non-existent"'
    );
  });

  it('should properly destroy the extended scrollbar component', () => {
    component.createScrollbarExt('#target-x', '#viewport');

    expect(component.scrollbarRef).toBeTruthy();

    spyOn(component.scrollbarRef, 'destroy').and.callThrough();
    spyOn(component.scrollbarRef.componentRef, 'destroy').and.callThrough();
    spyOn(appRef, 'detachView').and.callThrough();

    component.scrollbarRef.destroy();

    expect(appRef.detachView).toHaveBeenCalledWith(component.scrollbarRef.componentRef.hostView);
    expect(component.scrollbarRef.componentRef.destroy).toHaveBeenCalled();
    expect(component.scrollbarRef.destroy).toHaveBeenCalled();
  });
});
