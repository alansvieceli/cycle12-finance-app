# Plan 009 - Commitment Color Thresholds

## Spec Reference

`docs/specs/009-commitment-color-thresholds.md`

## Objective

Add configurable warning and danger color thresholds to the commitment percentage shown in the Summary tab. Configuration lives in the Settings tab and is persisted with the rest of the finance state.

## Assumptions

- The commitment percentage is already calculated by `calculateIncomeCommitmentPercentage` and displayed in `MonthSummaryCard` or `SummaryScreen`.
- Color logic is a pure function of the commitment ratio and the two threshold values — no new state is needed.
- `normalizeFinanceState` in `financeStorage.ts` already handles backward-compatible defaults via spread with `emptyFinanceState.settings`, so adding fields there is enough to handle old persisted data.
- Threshold inputs accept whole numbers (0–100). No decimal input is needed.
- The existing `CurrencyInput` component is not appropriate for integer percentage fields; a plain `TextInput` with numeric keyboard is used, similar to `VisibleMonthCountInput` in `SettingsScreen`.

## Tasks

| Task | File | Description |
|---|---|---|
| 009-01 | `009-01-add-plan-and-tasks.md` | Create this plan and all task files. |
| 009-02 | `009-02-update-data-model.md` | Add threshold fields to `FinanceSettings`, `emptyFinanceState`, `normalizeFinanceState`, and `useFinanceState` actions. |
| 009-03 | `009-03-add-commitment-color-helper.md` | Add pure helper `resolveCommitmentColor` in `src/lib/` with unit tests. |
| 009-04 | `009-04-update-settings-screen.md` | Add warning and danger threshold inputs to `SettingsScreen`. |
| 009-05 | `009-05-update-summary-color.md` | Apply `resolveCommitmentColor` to the commitment percentage field in `SummaryScreen` or `MonthSummaryCard`. |
| 009-06 | `009-06-update-docs-and-validate.md` | Update README, run TypeScript check and tests. |

## Sequential Order

009-01 → 009-02 → 009-03 → 009-04 → 009-05 → 009-06

009-03 depends on 009-02 (needs the updated type).
009-04 depends on 009-02 (needs the new actions).
009-05 depends on 009-03 (needs the helper).
009-06 depends on all previous tasks.

## Validation

- `npx tsc --noEmit` passes with no errors.
- `npm test` passes.
- Manual: set warning 80, danger 90 — confirm colors change at each threshold.
- Manual: set both to 0 — confirm default color always.

## Out of Scope

- Color thresholds for any field other than commitment percentage.
- Per-month overrides.
- Animations, icons, or badges.
