# Plan 025 - Hide Values Toggle

## Objective

Add a session-only eye icon toggle to the greeting row that hides all monetary values across every tab, replacing them with a masked placeholder.

## Implementation Plan

1. Create the `EyeIcon` component with two SVG states (open/closed), derived from `assets/eye-open.svg` and `assets/eye-closed.svg`.
2. Add the `maskCurrency` helper to `src/lib/formatters.ts`.
3. Wire the `valuesHidden` boolean state in `FinanceApp.tsx` and update the greeting row to show the eye button.
4. Propagate `valuesHidden` down all affected prop chains and apply `maskCurrency` in every display component, including chart labels.
5. Update `EditableAmountInput` to show `• • •` when `valuesHidden && !isFocused`.
6. Update `docs/app-context.md` and validate.

## Task Breakdown

- `025-01-add-eye-icon-component.md`
- `025-02-add-mask-currency-helper.md`
- `025-03-wire-values-hidden-state.md`
- `025-04-mask-display-values.md`
- `025-05-mask-editable-input.md`
- `025-06-update-docs-and-validate.md`

## Assumptions

- No new dependencies. `react-native-svg` is already installed.
- `valuesHidden` is not persisted to `AsyncStorage`. It resets to `false` on every cold start.
- Percentage values are not masked.
- The adjustment modal (+/–) in `MonthlyValueEditor` is never masked.
- The background circles in the SVG asset files are not used in the component — the `Pressable` provides the touch target.

## Validation

- `npm run lint`
- `npm run typecheck`
- `npm test`

When practical, validate on Android emulator:

- Eye icon appears on the greeting row on every tab.
- Tapping hides all monetary values simultaneously.
- Tapping again restores all values.
- In Planejar, each month value shows `• • •` at rest and the real value when tapped.
- Tapping +/– opens the adjustment modal with a normal unmasked input.
- Reopening the app resets to visible.
