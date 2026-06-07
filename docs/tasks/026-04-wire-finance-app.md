# Task 026-04 - Wire FinanceApp

## Spec

`docs/specs/026-add-account-from-payments.md`

## Plan

`docs/plans/026-add-account-from-payments-plan.md`

## Goal

Pass `onCreateAccountItem={finance.actions.createAccountItemAndSetValue}` to `CurrentMonthPaymentChecklist` in `FinanceApp.tsx` and validate the full build.

## Steps

1. In `src/FinanceApp.tsx`, add `onCreateAccountItem={finance.actions.createAccountItemAndSetValue}` to the `CurrentMonthPaymentChecklist` usage.
2. Run `npm run check` (lint + format + typecheck + tests) and confirm no errors.
3. Commit.

## Acceptance Criteria

- `FinanceApp.tsx` passes the action as a prop.
- `npm run check` passes with no errors.
