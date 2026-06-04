# Task 003-04 - Refine Planning Tab

## Plan Reference

`docs/plans/003-tabbed-finance-workflow-plan.md`

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Prerequisite

Tasks `003-01` through `003-03` must be complete.

## Objective

Improve the `Planejamento` workflow for account creation, account editing, and monthly value editing.

## Steps

1. Keep account creation/editing in `Planejamento`.
2. Make category assignment clearer than cycling categories blindly.
3. Show due day editing near the account metadata.
4. Show monthly values for the selected account.
5. Keep values editable for up to 12 months.
6. Ensure edits recalculate summary values.

## Acceptance Criteria

- User can create/edit/delete accounts in `Planejamento`.
- User can assign a category to an account.
- User can edit due day.
- User can edit monthly values.
- Empty value is treated as zero.
- TypeScript validation passes.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
