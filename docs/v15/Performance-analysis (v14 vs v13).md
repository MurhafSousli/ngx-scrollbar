The following are test results from Chrome dev tools, scrolling for 5 seconds in version 14 vs version 13.

## Scrolling using the wheel / touchpad

Performance using CSS scroll-timeline feature:

<p align="center">
  <img width="600px" style="text-align: center;" src="https://github.com/MurhafSousli/ngx-scrollbar/assets/8130692/cad67cef-3e5b-4fa4-81b1-f58c7d18905a">
  <h5 align="center">Scrolling using the wheel / touchpad (version >= 14)</h5>
</p>

***

Performance using JS scroll event:

<p align="center">
  <img width="600px" style="text-align: center;" src="https://github.com/MurhafSousli/ngx-scrollbar/assets/8130692/43e95f72-fcf4-411e-9a53-7788f229469b">
  <h5 align="center">Scrolling using the wheel / touchpad (version < 14)</h5>
</p>

## Scrolling using pointer dragging


Performance using CSS scroll-timeline feature + dragging using JS pointer events:

<p align="center">
  <img width="600px" style="text-align: center;" src="https://github.com/MurhafSousli/ngx-scrollbar/assets/8130692/60de3d00-4b34-40fa-9342-cfebd8c1871d">
  <h5 align="center">Dragging scrollbar using pointer (version >= 14)</h5>
</p>


Performance using JS scroll event + dragging using JS pointer events:

<p align="center">
  <img width="600px" style="text-align: center;" src="https://github.com/MurhafSousli/ngx-scrollbar/assets/8130692/aecfd4ce-d324-42ea-a795-55094390ce4e">
  <h5 align="center">Dragging scrollbar using pointer (version < 14)</h5>
</p>
