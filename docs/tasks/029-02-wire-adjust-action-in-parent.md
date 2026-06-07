# Task 029-02 - Wire Adjust Action in Parent

Status: Pending

## Spec

`docs/specs/029-adjust-account-value-from-payments.md`

## Plan

`docs/plans/029-adjust-account-value-from-payments-plan.md`

## Goal

Pass `finance.actions.adjustMonthlyValue` to `CurrentMonthPaymentChecklist` via the `onAdjustMonthlyValue` prop in the parent component.

## Steps

1. Locate where `CurrentMonthPaymentChecklist` is rendered in the app (the Pagamentos secondary view).
2. Pass `onAdjustMonthlyValue={finance.actions.adjustMonthlyValue}` as a prop.
3. Confirm the existing `onCreateAccountItem` and `onTogglePaymentStatus` props are unaffected.

## Acceptance Criteria

- `CurrentMonthPaymentChecklist` receives `onAdjustMonthlyValue` from the parent.
- Applying an adjustment from the Pagamentos screen persists the new value.
- TypeScript validation passes with no new errors.
