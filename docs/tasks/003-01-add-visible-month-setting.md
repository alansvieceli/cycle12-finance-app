# Task 003-01 - Add Visible Month Setting

## Plan Reference

`docs/plans/003-tabbed-finance-workflow-plan.md`

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Objective

Add `visibleMonthCount` to finance settings and use it to control how many months are displayed.

## Steps

1. Add `visibleMonthCount` to the settings type.
2. Default `visibleMonthCount` to `12`.
3. Normalize loaded storage data so older saved data gets `visibleMonthCount`.
4. Keep the app capable of generating/storing up to 12 projection months.
5. Use `visibleMonthCount` to choose which months are displayed in summary-oriented views.

## Acceptance Criteria

- `visibleMonthCount` exists in settings.
- Default value is `12`.
- Values are clamped from 1 to 12.
- Existing saved data without `visibleMonthCount` still loads.
- TypeScript validation passes.
- Existing tests pass.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
