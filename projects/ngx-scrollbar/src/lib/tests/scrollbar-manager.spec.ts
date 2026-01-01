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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created and initPolyfill', () => {
    expect(scrollbarManager).toBeDefined();
  });

  it('should load polyfill script and set scrollTimelinePolyfill', async () => {
    // In Chrome, it will not be possible to test if the polyfill sets window.ScrollTimeline
    // Therefore, we will only test the script functionality
    const scriptMock: HTMLScriptElement = scrollbarManager.document.createElement('script');
    vi.spyOn(scrollbarManager.document, 'createElement').mockReturnValue(scriptMock);

    await scrollbarManager.initPolyfill();

    expect(scrollbarManager.document.createElement).toHaveBeenCalledWith('script');
    expect(scriptMock.src).toBe(scrollbarManager._polyfillUrl);
    expect(scrollbarManager.window['ScrollTimeline']).toBeTruthy();
    expect(scrollbarManager.scrollTimelinePolyfill()).toBe(scrollbarManager.window['ScrollTimeline']);
  });

  it('should log an error if an error occurs while loading the ScrollTimeline script', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error'); // Use "and.callThrough()" to allow the actual console.error to be called
    const errorMessage: string = 'mock_error_message';
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await scrollbarManager.initPolyfill();

    expect(consoleErrorSpy).toHaveBeenCalledWith('[NgScrollbar]: Error loading ScrollTimeline script:', expect.any(Error)); // Adjust expectation to match the Error object
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

    const consoleErrorSpy = vi.spyOn(console, 'error');

    await scrollbarManager.initPolyfill();

    expect(scrollbarManager.scrollTimelinePolyfill()).toBeFalsy();
    expect(consoleErrorSpy).toHaveBeenCalledWith('[NgScrollbar]: Polyfill script loaded but ScrollTimeline not found.');

    // Restore the ScrollTimeline function
    window['ScrollTimeline'] = scrollTimelineBackup;
  });
});


describe('ScrollbarManager: call initPolyfill in constructor based on browser', () => {
  let originalScrollTimeline;
  let initPolyfillSpy;

  beforeEach(() => {
    originalScrollTimeline = window['ScrollTimeline'];
    initPolyfillSpy = vi.spyOn(ScrollbarManager.prototype, 'initPolyfill');
  });

  afterEach(() => {
    if (originalScrollTimeline === undefined) {
      delete window['ScrollTimeline'];
    } else {
      window['ScrollTimeline'] = originalScrollTimeline;
    }
    vi.restoreAllMocks();
  });

  it('should call initPolyfill if browser cannot use scrollTimeline (Firefox)', () => {
    // In Firefox ScrollTimeline isn't supported, we need to remove it
    delete window['ScrollTimeline'];

    TestBed.runInInjectionContext(() => {
      new ScrollbarManager();
    });
    TestBed.tick();

    expect(initPolyfillSpy).toHaveBeenCalled();
  });


  it('should not call initPolyfill if browser can use scrollTimeline', () => {
    // Mock Chrome environment
    TestBed.runInInjectionContext(() => {
      new ScrollbarManager();
    });

    expect(initPolyfillSpy).not.toHaveBeenCalled();
  });
});
