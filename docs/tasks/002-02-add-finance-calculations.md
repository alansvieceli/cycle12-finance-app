# Task 002-02 - Add Finance Calculations

## Plan Reference

`docs/plans/002-local-finance-projection-plan.md`

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Prerequisite

Task `002-01` must be complete.

## Objective

Add pure TypeScript calculation helpers for the 12-month finance projection.

## Steps

1. Add helpers to generate up to 12 projection months from the current month.
2. Add helper to calculate category totals per month.
3. Add helper to calculate total expenses per month.
4. Add helper to calculate salary commitment percentage.
5. Add helper to calculate surplus/shortfall.
6. Ensure current month calculations include `currentMonthExtraBalance`.
7. Ensure future month calculations ignore `currentMonthExtraBalance`.
8. Add focused unit tests if test tooling exists or is introduced in this task.

## Acceptance Criteria

- Calculation helpers are pure and independent from React UI.
- Category totals are calculated correctly.
- Monthly total expenses are calculated correctly.
- Salary commitment percentage is calculated correctly.
- Missing or zero salary does not produce an invalid percentage.
- Current month surplus/shortfall includes extra balance.
- Future month surplus/shortfall does not include extra balance.
- No UI behavior is implemented in this task.

## Validation

Run:

```bash
npx tsc --noEmit
```

If tests exist or are added, run the project test command.

## Documentation

No README update is required unless a test command or dependency is added.
