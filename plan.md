# Plan for Training Manual Scroll Snap and Dark Theme Toggle

## Objective
Implement responsive, scroll-snapping full-screen slides for the training manual and a persistent dark theme toggle with smooth transitions.

## Scope
- **Target File:** `src/App.tsx`
- **Features:**
    1.  **Scroll Snapping:**
        - Add `scroll-snap-type: y mandatory` to the training manual's container element.
        - Ensure individual slide sections occupy `100vw` and `100vh`.
        - Apply `scroll-snap-align: start` to each slide element.
    2.  **Dark Theme Toggle:**
        - Integrate a persistent theme toggle mechanism.
        - Theme persistence should use `localStorage` or `prefers-color-scheme`.
        - Update CSS variables (`--primary-color`, `--background-color`, `--text-color`) on `html` and `body` elements.
        - Implement smooth CSS `transition` for theme variable changes.
        - The toggle button should be accessible (e.g., in the header).

## Constraints & Preservations
- Existing slide content, animations, navigation buttons (Next/Previous), progress indicator, and overall Keynote/TED style must be preserved.
- All other application sections (Header, Launchpad, Mission Generator, Submission System, Wall of Fame) must remain unaffected.

## Implementation Notes
- Modify the `PremiumPresentation` component in `src/App.tsx` to handle scroll snapping.
- Add state and logic within `App` component or `PremiumPresentation` for theme toggling.
- Update global CSS variables in `src/index.css` or directly in `App.tsx` if necessary.
- Test thoroughly for responsiveness and cross-browser compatibility.
