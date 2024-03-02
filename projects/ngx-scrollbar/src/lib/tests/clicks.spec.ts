import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { NgScrollbar } from 'ngx-scrollbar';
import { setDimensions } from './common-test.';
import { firstValueFrom } from 'rxjs';

describe('Scrollbar thumb dragging styles', () => {
  let component: NgScrollbar;
  let fixture: ComponentFixture<NgScrollbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrollbar],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NgScrollbar);
    component = fixture.componentInstance;
  });

  it('[Pointer] should set "isDragging" to true when vertical scrollbar thumb is being dragged', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 200, contentHeight: 200 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    component._scrollbars.y.thumb.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));
    expect(component.dragging()).toBe('y');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('y');

    component.viewport.nativeElement.dispatchEvent(new PointerEvent('pointerup'));
    expect(component.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });


  it('[Pointer] should set "isDragging" to true when horizontal scrollbar is being dragged', async () => {
    setDimensions(component, { cmpWidth: 100, cmpHeight: 100, contentWidth: 200, contentHeight: 200 });
    component.ngOnInit();
    component.ngAfterViewInit();
    await firstValueFrom(component.afterInit);

    component._scrollbars.x.thumb.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));
    expect(component.dragging()).toBe('x');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('x');

    component.viewport.nativeElement.dispatchEvent(new PointerEvent('pointerup'));
    expect(component.dragging()).toBe('none');
    fixture.detectChanges();
    expect(component.nativeElement.getAttribute('dragging')).toBe('none');
  });
});
