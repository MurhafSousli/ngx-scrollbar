import { fromEvent, Observable } from 'rxjs';
import { preventSelection } from '../utils/common';

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
