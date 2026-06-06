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
- Revised quick Figma rules in the spec and tightened the app against them: currency keeps two decimals, core touch targets are at least 44 px, card radii use the 16-24 px range, and account/category deletion now requires confirmation.
- Matched chart total labels to sentence case and applied commitment colors to the current-month category total.
- Split the `Contas` screen into `Categorias` and `Contas` sections and reduced editor field typography for the compact layout.
- Refined `Ajustes` fields into compact label/value rows and removed uppercase styling from setting labels.
- Refined settings copy, amount formatting, current-window display, and data-management action hierarchy.
- Shortened month/year labels to `Mês/Ano` and right-aligned threshold helper text in `Ajustes`.
- Grouped commitment thresholds into a single compact settings box and kept the current window on one line.
- Grouped the current projection window into its own highlighted settings box.
- Grouped the primary settings fields and removed the local-save helper text from `Ajustes`.
