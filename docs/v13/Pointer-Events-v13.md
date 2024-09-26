The pointer-events here means the method this library use to detect the dragging of the scrollbar and the hover effect on the scrollbar

There are 2 methods to detect pointer events

```html
<ng-scrollbar pointerEventsMethod="viewport">
```

- `pointerEventsMethod="viewport"`, will detect pointer events using viewport's `mousemove`, `mousedown` and `mouseleave` events.

- `pointerEventsMethod="scrollbar"`, will detect pointer events using scrollbar `mousedown`, `mouseenter` and `mouseleave` event.

### In a nutshell, here are the pros and cons of each method with the `[appearance]` option:

<table>
  <thead>
    <tr>
      <th>Appearance ↓</th>
      <th>viewport</th>
      <th>scrollbar</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Standard</b></td>
      <td>
        <ul>
          <li><u>Only if both scrollbars appear</u>, the content may overlap under the scrollbar</li>
          <li>Scrolling over scrollbar works</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>The content never overlap under the scrollbars</li>
          <li>Scrolling over scrollbar doesn't work</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><b>Compact</b></td>
      <td>
        <ul>
          <li>Content overlaps under the scrollbar as intended</li>
          <li>Scrolling over scrollbar works</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>The content overlaps under the scrollbar as intended</li>
          <li>Scrolling over scrollbar doesn't work</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

> **My recommendation:** If scrolling over scrollbar isn't a big deal, then go with `pointerEventsMethod="scrollbar"`.

---

*Theoretically `scrollbar` method is more performant because `viewport` method checks if the pointer is over the scrollbars while the pointer is moving over the viewport.*

*But most of the time, there won't be any difference in performance unless you have a complex design. try both and see what best fits your app.*

### 📌 Note

The pointer-events are disabled on mobile browsers by design. because there is no pointer 😄