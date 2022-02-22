import { TestBed } from '@angular/core/testing';
import { NativeScrollbarSizeFactory } from './native-scrollbar-size-factory';

describe('NativeScrollSizeFactory Service', () => {

  let service: NativeScrollbarSizeFactory;

  beforeEach(() => {
    service = TestBed.inject(NativeScrollbarSizeFactory);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should emit the native scrollbar size', (doneFn: DoneFn) => {
    service.scrollbarSize.subscribe((size: number) => {
      expect(size).toBe(0);
      doneFn();
    });
  });
});
