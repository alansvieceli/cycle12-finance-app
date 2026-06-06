# Task 025-03 - Wire valuesHidden State

## Spec

`docs/specs/025-hide-values-toggle.md`

## Plan

`docs/plans/025-hide-values-toggle-plan.md`

## Goal

Add the `valuesHidden` state to `FinanceApp.tsx` and update the greeting row to show the eye toggle button.

## Steps

1. Open `src/FinanceApp.tsx`.
2. Add `const [valuesHidden, setValuesHidden] = useState(false)` alongside the existing state declarations.
3. Convert the greeting `Text` row into a `flexDirection: 'row'` `View` with `justifyContent: 'space-between'` and `alignItems: 'center'`.
4. Keep the `Aloha :)` `Text` on the left with its current style.
5. Add a `Pressable` on the right wrapping `<EyeIcon hidden={valuesHidden} color={valuesHidden ? colors.accent : colors.textSecondary} />`.
6. Set `minHeight: 44` and `minWidth: 44` on the `Pressable` with `alignItems: 'center'` and `justifyContent: 'center'` for the touch target.
7. On press: `setValuesHidden((v) => !v)`.
8. Pass `valuesHidden` as a prop to `SummaryScreen`, `CurrentMonthPaymentChecklist`, `ChartsScreen`, and `PlanningScreen`. Do not apply masking yet — that is task 025-04 and 025-05.

## Acceptance Criteria

- The greeting row shows `Aloha :)` on the left and the eye icon on the right.
- The eye icon is visible on every tab (the greeting row persists across all tabs).
- Tapping the icon toggles the icon between open and closed states.
- Icon color is `colors.textSecondary` when visible and `colors.accent` when hidden.
- `valuesHidden` prop is accepted by all downstream screen components (even if unused until the next tasks).
- TypeScript validation passes.
