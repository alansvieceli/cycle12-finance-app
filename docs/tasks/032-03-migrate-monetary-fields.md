# Task 032-03 - Migrate Monetary Fields

Status: Completed

## Spec

`docs/specs/032-currency-input-mask.md`

## Plan

`docs/plans/032-currency-input-mask-plan.md`

## Goal

Make every monetary field use the masked `EditableAmountInput` and move the typing path from string parsing to numeric values.

## Steps

1. `MonthlyValueEditor`: use the masked input for the inline month value and the `±` adjustment modal; update the confirm-label formatting to the numeric flow.
2. `CurrentMonthPaymentChecklist`: use the masked input for the new account value and the `±` adjustment modal.
3. `SummaryScreen`: use the masked input in the quick-add extra balance modal.
4. `SettingsScreen` via `CurrencyInput`: salary and current month extra balance.
5. Update `useFinanceState` actions that parsed raw strings (`updateMonthlySalary`, `updateCurrentMonthExtraBalance`, monthly value updates) to accept `number` where it keeps the change contained; remove `parseCurrencyInput` from the typing path.
6. Update `monthlyValueAdjustments.ts` callers accordingly.
7. Update existing tests affected by the signature changes.

## Acceptance Criteria

- All monetary fields listed in the spec use the masked input with `number-pad`.
- No screen calls `parseCurrencyInput` in the typing path.
- Values saved to state match the displayed amount exactly.
- `±` modal confirm labels update correctly while typing.
- Visual styles of each field are unchanged.
- TypeScript validation and the test suite pass.
