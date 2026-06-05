# Task 021-04 - Refine Figma Layouts

## Goal

Bring the main screens closer to the Figma layout while keeping implementation simple and maintainable.

## Scope

- Refine summary KPIs and payment shortcut.
- Refine payment checklist styling.
- Refine chart cards.
- Refine planning/account/settings panels for the new visual system.

## Acceptance Criteria

- Main screens visually follow the Figma direction.
- Existing runtime data drives all values.
- No new unsupported finance behavior is introduced.

## Implementation Notes

- Increased the summary header logo by 50% after visual review.
- Increased the summary header logo by another 30% and adjusted its left alignment with the greeting.
- Refined the header logo box to account for transparent PNG padding and reduced the greeting to 24px.
- Balanced the vertical spacing above the greeting with the spacing before the month controls.
- Aligned the summary commitment percentage color with the progress bar states: default white, warning yellow, and danger red.
