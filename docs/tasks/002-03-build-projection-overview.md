# Task 002-03 - Build Projection Overview

## Plan Reference

`docs/plans/002-local-finance-projection-plan.md`

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Prerequisite

Tasks `002-01` and `002-02` must be complete.

## Objective

Build the main mobile-first 12-month projection overview screen.

## Steps

1. Replace the temporary home screen with the finance projection experience.
2. Show up to 12 months starting from the current month.
3. For each month, show:
   - total expenses
   - salary commitment percentage
   - surplus/shortfall
4. Show category totals for each month.
5. Use the calculation helpers from task `002-02`.
6. Keep the layout practical and scannable on Android.

## Acceptance Criteria

- App opens to a finance projection overview.
- Up to 12 months are displayed.
- Each month displays total expenses.
- Each month displays salary commitment percentage when salary is available.
- Each month displays surplus/shortfall.
- Category totals are visible.
- No category/account editing is required in this task.
- No monthly value editing is required in this task.

## Validation

Run:

```bash
npx tsc --noEmit
```

When applicable, run:

```bash
npx expo start
```

Confirm the screen renders on Android.

## Documentation

Update README if app behavior documentation is needed.
