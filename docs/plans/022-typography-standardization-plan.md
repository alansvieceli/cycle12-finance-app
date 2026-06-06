# Plan 022 - Typography Standardization

## Objective

Centralize and apply typography tokens across the app without redesigning layouts.

## Audit Summary

- Found 101 `fontSize`, 83 `fontWeight`, and 16 `lineHeight` declarations in `src`.
- Most repeated roles are section titles, small labels, amounts, buttons, inputs, chart labels, and helper text.
- Main inconsistencies:
  - label-like text ranges from 10 to 13.
  - amount-like text ranges from 13 to 34.
  - title-like text ranges from 15 to 24.
  - body/helper line heights are manually repeated with small differences.
  - buttons and filters use similar visual roles with different weights.

## Short Implementation Plan

1. Add `src/theme/typography.ts` with semantic text tokens.
2. Migrate shared components and app shell first.
3. Migrate finance components and screens one file at a time.
4. Keep justified exceptions only where third-party chart rendering or icon-like text requires exact sizing.
5. Validate lint, TypeScript, and tests.

## Assumptions

- Pure typography migration does not require new unit tests.
- The existing app visual direction from spec 021 remains the baseline.
- If a text role already visually works but uses a nearby size, prefer mapping it to the closest token rather than preserving a one-off value.

## Validation

Run:

- `npm run lint`
- `npm run typecheck`
- `npm test`
