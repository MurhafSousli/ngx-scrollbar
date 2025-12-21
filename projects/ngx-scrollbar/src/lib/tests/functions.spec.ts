import { fromEvent, Observable } from 'rxjs';
import { preventSelection, restoreSelection, saveSelection } from '../utils/common';

describe('Common functions', () => {
  let mockDoc: Document;

  beforeEach(() => {
    mockDoc = document.implementation.createHTMLDocument();
  });

  it('preventSelection should set onselectstart to prevent selection', () => {
    const pointerEvent$: Observable<PointerEvent> = fromEvent<PointerEvent>(mockDoc, 'pointerdown').pipe(
      preventSelection(mockDoc)
    );

    // Subscribe to trigger the tap operator
    pointerEvent$.subscribe();

    // Simulate a pointer down event
    const event: PointerEvent = new PointerEvent('pointerdown');
    mockDoc.dispatchEvent(event);

    expect(mockDoc.onselectstart).toBeDefined();
    expect(mockDoc.onselectstart).toBeInstanceOf(Function);

    // Create a mock event to pass to the onselectstart handler
    const selectEvent: Event = new Event('selectstart');

    // Call the onselectstart handler with the mock event
    const result = mockDoc.onselectstart!(selectEvent); // Use non-null assertion

    expect(result).toBe(false);
  });
});


describe('Selection Persistence Utilities', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a sandbox for each test to provide real DOM nodes for ranges
    container = document.createElement('div');
    container.innerHTML = '<p id="p1">Hello World</p><p id="p2">Testing Selection</p>';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up DOM and reset the selection
    document.body.removeChild(container);
    window.getSelection()?.removeAllRanges();
  });

  it('should capture and restore a single text selection', () => {
    const p1 = document.getElementById('p1')!;
    const selection = window.getSelection()!;
    const range = document.createRange();

    // 1. Select "Hello"
    range.setStart(p1.firstChild!, 0);
    range.setEnd(p1.firstChild!, 5);
    selection.addRange(range);

    expect(selection.toString()).toBe('Hello');

    // 2. Save and Clear
    saveSelection(document);
    selection.removeAllRanges();
    expect(selection.toString()).toBe('');

    // 3. Restore
    restoreSelection(document);
    const restoredSelection = window.getSelection()!;
    expect(restoredSelection.toString()).toBe('Hello');
    expect(restoredSelection.rangeCount).toBe(1);
  });

  it('should handle multiple ranges if the browser supports it', () => {
    // Note: Most browsers (Chrome/Firefox) only support 1 range,
    // but the code should technically handle it if rangeCount > 1.
    const p1 = document.getElementById('p1')!;
    const p2 = document.getElementById('p2')!;
    const selection = window.getSelection()!;

    // Create two distinct ranges
    const r1 = document.createRange();
    r1.selectNodeContents(p1);

    const r2 = document.createRange();
    r2.selectNodeContents(p2);

    selection.addRange(r1);

    const countBefore = selection.rangeCount;

    saveSelection(document);
    selection.removeAllRanges();
    restoreSelection(document);

    expect(window.getSelection()!.rangeCount).toBe(countBefore);
  });

  it('should not crash or remove ranges if saveSelection was never called', () => {
    const p1 = document.getElementById('p1')!;
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(p1);
    selection.addRange(range);

    // Act: Call restore without a previous save
    // We expect it to return early via: if (!savedRanges?.length) return;
    restoreSelection(document);

    expect(selection.rangeCount).toBe(1);
    expect(selection.toString()).toBe('Hello World');
  });

  it('should return early if the document has no selection count', () => {
    const selection = window.getSelection()!;
    selection.removeAllRanges();

    // Should not throw
    expect(() => saveSelection(document)).not.toThrow();
  });
});
