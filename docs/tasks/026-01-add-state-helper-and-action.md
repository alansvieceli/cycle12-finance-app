# Task 026-01 - Add State Helper and Action

## Spec

`docs/specs/026-add-account-from-payments.md`

## Plan

`docs/plans/026-add-account-from-payments-plan.md`

## Goal

Add the `buildAccountItemWithValueState` pure exported helper and the `createAccountItemAndSetValue` action to `useFinanceState.ts`, with unit tests for the helper.

## Steps

1. Create `src/hooks/useFinanceState.test.ts` with 5 tests for `buildAccountItemWithValueState`: adds item, trims name, adds MonthlyValue when amount > 0, no MonthlyValue when amount is 0, preserves existing state.
2. Run the tests to confirm they fail (function not yet exported).
3. Add `buildAccountItemWithValueState` as a pure exported function at the bottom of `src/hooks/useFinanceState.ts`, after the existing `adjustMonthlyValueAmount` helper.
4. Add the `createAccountItemAndSetValue` action inside the hook body; it generates a new id, calls `setFinanceState` with the helper, and calls `setSelectedAccountItemId`.
5. Expose `createAccountItemAndSetValue` in the `actions` object returned by the hook.
6. Run the tests again to confirm all 5 pass.
7. Run `npm run typecheck` and confirm no errors.
8. Commit.

## Acceptance Criteria

- `buildAccountItemWithValueState` is exported from `useFinanceState.ts`.
- All 5 unit tests pass.
- `createAccountItemAndSetValue` is present in `useFinanceState` actions.
- TypeScript validation passes.
