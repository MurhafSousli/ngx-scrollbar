import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideScrollbarPolyfill } from 'ngx-scrollbar';
import { ScrollbarManager } from '../utils/scrollbar-manager';

describe('ScrollbarManager Service', () => {

  let scrollbarManager: ScrollbarManager;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScrollbarManager,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ]
    });
    scrollbarManager = TestBed.inject(ScrollbarManager);
  });

  it('should be created and initPolyfill', () => {
    expect(scrollbarManager).toBeDefined();
  });

  it('should load polyfill script and set scrollTimelinePolyfill', async () => {
    // In Chrome, it will not be possible to test if the polyfill sets window.ScrollTimeline
    // Therefore, we will only test the script functionality
    const scriptMock: jasmine.SpyObj<HTMLScriptElement> = scrollbarManager.document.createElement('script') as jasmine.SpyObj<HTMLScriptElement>;
    spyOn(scrollbarManager.document, 'createElement').and.returnValue(scriptMock);

    const scrollTimelineFunction: jasmine.Spy = jasmine.createSpy('scrollTimelineFunction');
    // @ts-expect-error return the Window type after assigning ScrollTimeline to make lint happy
    spyOnProperty(scrollbarManager.document, 'defaultView').and.returnValue({ ScrollTimeline: scrollTimelineFunction } as Window);

    await scrollbarManager.initPolyfill();

    expect(scrollbarManager.document.createElement).toHaveBeenCalledWith('script');
    expect(scriptMock.src).toBe(scrollbarManager._polyfillUrl);
    expect(scrollbarManager.window['ScrollTimeline']).toBeTruthy();
    expect(scrollbarManager.scrollTimelinePolyfill()).toBe(scrollbarManager.window['ScrollTimeline']);
  });


  it('should log an error if an error occurs while loading the ScrollTimeline script', async () => {
    const consoleErrorSpy: jasmine.Spy = spyOn(console, 'error').and.callThrough(); // Use "and.callThrough()" to allow the actual console.error to be called
    const errorMessage: string = 'mock_error_message';
    spyOn(document, 'createElement').and.throwError(new Error(errorMessage)); // Throw an Error object

    await scrollbarManager.initPolyfill();

    expect(consoleErrorSpy).toHaveBeenCalledWith('[NgScrollbar]: Error loading ScrollTimeline script:', jasmine.any(Error)); // Adjust expectation to match the Error object
  });
});

describe('Override ScrollTimeline polyfill', () => {

  let scrollbarManager: ScrollbarManager;
  const inlineCode: string = `console.log('Fake script');`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScrollbarManager,
        provideScrollbarPolyfill(`data:text/javascript;charset=utf-8,${ encodeURIComponent(inlineCode) }`)
      ]
    });
    scrollbarManager = TestBed.inject(ScrollbarManager);
  });

  it('should log an error if ScrollTimeline is not attached to the window object', async () => {
    const scrollTimelineBackup = window['ScrollTimeline'];
    // In chrome ScrollTimeline is supported, we need to remove it
    delete window['ScrollTimeline'];

    const consoleErrorSpy: jasmine.Spy = spyOn(console, 'error');

    await scrollbarManager.initPolyfill();

    expect(scrollbarManager.scrollTimelinePolyfill()).toBeFalsy();
    expect(consoleErrorSpy).toHaveBeenCalledWith('[NgScrollbar]: ScrollTimeline is not attached to the window object.');

    // Restore the ScrollTimeline function
    window['ScrollTimeline'] = scrollTimelineBackup;
  });
});


describe('ScrollbarManager: call initPolyfill in constructor based on browser', () => {
  let initPolyfillSpy: jasmine.Spy;

  beforeEach(() => {
    initPolyfillSpy = spyOn(ScrollbarManager.prototype, 'initPolyfill');
  });

  it('should call initPolyfill if conditions are met (Firefox/Safari)', () => {
    // Mock Firefox/Safari environment
    const scrollTimelineBackup = window['ScrollTimeline'];
    // In chrome ScrollTimeline is supported, we need to remove it
    delete window['ScrollTimeline'];

    TestBed.runInInjectionContext(() => {
      new ScrollbarManager();
      expect(initPolyfillSpy).toHaveBeenCalled();
    });

    // Restore the ScrollTimeline function
    window['ScrollTimeline'] = scrollTimelineBackup;
  });


  it('should call initPolyfill if conditions are not met (Chrome)', () => {
    // Mock Chrome environment
    TestBed.runInInjectionContext(() => {
      new ScrollbarManager();
      expect(initPolyfillSpy).not.toHaveBeenCalled();
    });
  });
});
