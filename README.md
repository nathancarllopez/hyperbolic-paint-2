Welcome to Hyperbolic Paint!

To do for resume:
- Do a mobile check (solve and find issues below)
  - Check if coordinates are visible underneath finger while dragging
- Style (for selected shapes) at bottom left corner
- Figure out orientation changes
  - Make toolbar vertical if in portrait mode
  - Make toolbar dropdowns drop to the side if in portrait mode
  - Resize axes when a change occurs
- Finish wiring up the number inputs in Settings.jsx

To do short term:
- Zooming in and out
- Sync the animation speed of the animation shape with that of the rest of the drawn shapes
- Make it so the animation speed slider displays units like "rotations per second" or "translation distances per second"
- Make fades in suggestion modal cleaner (the confirmation screen flashes to the form screen when the modal closes, for example)
- Make dimensions of style dropdown a reasonable size
- Make constants configurable in the settings tab (e.g., toast message durations)
- Have x-axis tick labels be visible on mobile landscape

To do long term:
- Custom animation via user input
- Tesselations with regular polygons
- Add toolbar icons in dropdowns (as badges?)
- Split up handleMouseDown in HypCanvas to be more readable (e.g., write a helper function for the part that checks if a shape was clicked)

Bugs: