# Task 002-04 - Build Settings Editor

## Plan Reference

`docs/plans/002-local-finance-projection-plan.md`

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Prerequisite

Tasks `002-01`, `002-02`, and `002-03` must be complete.

## Objective

Allow editing of the fixed monthly salary and the current month extra balance.

## Steps

1. Add UI controls for `monthlySalary`.
2. Add UI controls for `currentMonthExtraBalance`.
3. Ensure values are parsed as currency/number values.
4. Update projection calculations after settings change.
5. Keep extra balance scoped only to the current month.

## Acceptance Criteria

- User can edit fixed monthly salary.
- User can edit current month extra balance.
- Current month surplus/shortfall reacts to extra balance changes.
- Future months do not include current month extra balance.
- Invalid numeric input is handled without crashing.
- No backup, restore, or backend behavior is added.

## Validation

Run:

```bash
npx tsc --noEmit
```

When applicable, run Expo and manually verify settings updates on Android.

## Documentation

Update README if app behavior documentation is needed.
