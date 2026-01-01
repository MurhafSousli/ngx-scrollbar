import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationRef, Component, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { vi } from 'vitest';
import { NgScrollbarAnywhere, NgScrollbar, NgScrollbarExt, NgScrollbarRef } from 'ngx-scrollbar';

@Component({
  selector: 'sample-lib',
  template: `
    <div #host id="target" style="height: 100px">
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
  scrollbarRef: NgScrollbarRef<NgScrollbar | NgScrollbarExt>;

  hostElementRef: Signal<ElementRef> = viewChild('host');

  createScrollbar(host: string): void {
    this.scrollbarRef = this.anywhere.createScrollbar(host);
  }

  createScrollbarViaElementRef(): void {
    this.scrollbarRef = this.anywhere.createScrollbar(this.hostElementRef());
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

  it('should create a scrollbar component via selector', () => {
    component.createScrollbar('#target');
    fixture.detectChanges();

    expect(component.scrollbarRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef.instance).toBeInstanceOf(NgScrollbar);
  });

  it('should create a scrollbar component via ElementRef', () => {
    component.createScrollbarViaElementRef();
    fixture.detectChanges();

    expect(component.scrollbarRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef.instance).toBeInstanceOf(NgScrollbar);
  });

  it('should return null and log error when an invalid host selector is used', () => {
    vi.spyOn(console, 'error');

    component.createScrollbar('#non-existent');
    fixture.detectChanges();

    expect(component.scrollbarRef).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      '[NgScrollbar]: Could not find the host element!'
    );
  });

  it('should properly destroy the scrollbar component', () => {
    component.createScrollbar('#target');
    fixture.detectChanges();

    expect(component.scrollbarRef).toBeTruthy();

    const destroyScrollbarRefSpy = vi.spyOn(component.scrollbarRef, 'destroy');
    const destroyComponentRefSpy = vi.spyOn(component.scrollbarRef.componentRef, 'destroy');
    const detachSpy = vi.spyOn(appRef, 'detachView');

    component.destroyScrollbar();

    expect(detachSpy).toHaveBeenCalledWith(component.scrollbarRef.componentRef.hostView);
    expect(destroyScrollbarRefSpy).toHaveBeenCalled();
    expect(destroyComponentRefSpy).toHaveBeenCalled();
  });

  it('should create an extended scrollbar component', () => {
    component.createScrollbarExt('#target-x', '#viewport', '#content');
    fixture.detectChanges();

    expect(component.scrollbarRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef).toBeTruthy();
    expect(component.scrollbarRef?.componentRef.instance).toBeInstanceOf(NgScrollbarExt);

    const extScrollbarRef: NgScrollbarExt = component.scrollbarRef.componentRef.instance as NgScrollbarExt;
    expect(extScrollbarRef.externalViewport()).toBe('#viewport');
    expect(extScrollbarRef.externalContentWrapper()).toBe( '#content');
    expect(extScrollbarRef.externalSpacer()).toBe(undefined);
  });

  it('should return null and log error for an invalid extended scrollbar host', () => {
    vi.spyOn(console, 'error');

    component.createScrollbarExt('#non-existent', '#viewport');
    fixture.detectChanges();

    expect(component.scrollbarRef).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      '[NgScrollbar]: Could not find the host element!'
    );
  });

  it('should properly destroy the extended scrollbar component', () => {
    component.createScrollbarExt('#target-x', '#viewport');
    fixture.detectChanges();

    expect(component.scrollbarRef).toBeTruthy();

    const destroyScrollbarRefSpy = vi.spyOn(component.scrollbarRef, 'destroy');
    const destroyComponentRefSpy = vi.spyOn(component.scrollbarRef.componentRef, 'destroy');
    const detachSpy = vi.spyOn(appRef, 'detachView');

    component.scrollbarRef.destroy();

    expect(detachSpy).toHaveBeenCalledWith(component.scrollbarRef.componentRef.hostView);
    expect(destroyScrollbarRefSpy).toHaveBeenCalled();
    expect(destroyComponentRefSpy).toHaveBeenCalled();
  });
});
