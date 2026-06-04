# Task 002-01 - Add Local Storage Foundation

## Plan Reference

`docs/plans/002-local-finance-projection-plan.md`

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Objective

Add the local persistence foundation and define the core finance data model.

## Steps

1. Add a simple local storage dependency if needed.
2. Define TypeScript types for:
   - settings
   - categories
   - account items
   - monthly values
   - full finance state
3. Add a small storage adapter with functions to load and save finance state.
4. Keep storage details isolated from UI components.

## Acceptance Criteria

- Finance data model is represented with TypeScript types.
- Local storage adapter exists.
- Storage adapter can load and save the full finance state.
- No UI behavior is implemented in this task.
- No backend, authentication, backup, restore, or import/export is added.

## Validation

Run when available:

```bash
npx tsc --noEmit
```

If a dependency is added, confirm `package.json` and lockfile are updated.

## Documentation

Update README only if install or dependency instructions change in this task.
