# Task 002-05 - Build Category Account Editor

## Plan Reference

`docs/plans/002-local-finance-projection-plan.md`

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Prerequisite

Tasks `002-01` through `002-04` must be complete.

## Objective

Allow creating, editing, and deleting categories and account items.

## Steps

1. Add create/edit/delete controls for categories.
2. Add create/edit/delete controls for account items.
3. Allow each account item to be assigned to a category.
4. Allow each account item to define a due day.
5. Preserve sort order or apply a simple deterministic order.
6. Ensure deleting a category handles its account items safely.

## Acceptance Criteria

- User can create categories.
- User can edit category names.
- User can delete categories.
- User can create account items.
- User can edit account item name, category, and due day.
- User can delete account items.
- Due day is treated as a day of month.
- The ignored spreadsheet `*` marker is not represented in the UI.

## Validation

Run:

```bash
npx tsc --noEmit
```

When applicable, run Expo and manually verify category/account editing on Android.

## Documentation

Update README if app behavior documentation is needed.
