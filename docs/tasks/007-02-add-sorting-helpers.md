# Task 007-02 - Add Sorting Helpers

## Plan Reference

`docs/plans/007-sorting-and-compact-management-panels-plan.md`

## Spec Reference

`docs/specs/007-sorting-and-compact-management-panels.md`

## Objective

Add reusable helpers for consistent category and account ordering.

## Steps

1. Add sorting helpers for categories and accounts.
2. Treat missing or invalid category `sortOrder` as `0`.
3. Sort accounts by category order, category name, due day, and account name where account context is needed.
4. Add category order editing to the category management screen.
5. Add due-date-only ordering for the current-month payment checklist.
6. Add unit tests.

## Acceptance Criteria

- Sorting helpers exist in `src/lib/`.
- Missing or invalid category `sortOrder` behaves as `0`.
- Accounts use due day from lowest to highest because account order fields do not exist yet.
- Current-month payment checklist ignores category ordering and sorts only by due day, then account name.
- Category order can be edited from the category management screen.
- Account order does not need a screen field yet.
- Unit tests cover category/account ordering.

## Validation

Run:

```bash
npm test
```
