# Task 002-06 - Build Monthly Value Editor

## Plan Reference

`docs/plans/002-local-finance-projection-plan.md`

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Prerequisite

Tasks `002-01` through `002-05` must be complete.

## Objective

Allow editing monthly values for each account item across the projection months.

## Steps

1. Add UI for selecting or viewing an account item.
2. Show editable values for each projection month.
3. Save value changes into app state.
4. Recalculate category totals and monthly summaries after edits.
5. Treat credit card accounts as normal account items with editable monthly totals.

## Acceptance Criteria

- User can edit an account item value for each month.
- Edited values update the projection overview.
- Empty values are handled as zero.
- Currency/number input does not crash the app.
- Credit card bill totals are edited manually per month.
- No individual purchase or installment logic is added.

## Validation

Run:

```bash
npx tsc --noEmit
```

When applicable, run Expo and manually verify monthly value editing on Android.

## Documentation

Update README if app behavior documentation is needed.
