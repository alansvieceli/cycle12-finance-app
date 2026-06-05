# Task 015-02 - Add Finance State Adjustment Action

Status: Completed

## Spec

`docs/specs/015-monthly-value-adjustments.md`

## Plan

`docs/plans/015-monthly-value-adjustments-plan.md`

## Goal

Expose a finance state action that applies an adjustment to the current monthly account value.

## Steps

1. Add an action to `useFinanceState`.
2. Reuse the pure adjustment helper.
3. Create the monthly value when it does not exist yet.
4. Keep the existing direct edit action unchanged.

## Acceptance Criteria

- Existing direct monthly edits still work.
- Adjustment action updates only the final monthly amount.
- No persistent model shape changes are introduced.
