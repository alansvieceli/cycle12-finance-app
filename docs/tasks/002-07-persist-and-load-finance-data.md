# Task 002-07 - Persist And Load Finance Data

## Plan Reference

`docs/plans/002-local-finance-projection-plan.md`

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Prerequisite

Tasks `002-01` through `002-06` must be complete.

## Objective

Wire app state to local persistence so finance data survives app reloads.

## Steps

1. Load saved finance data on app startup.
2. Save finance data after user changes.
3. Provide sensible initial data or an empty state when no saved data exists.
4. Handle storage read/write errors without crashing.
5. Keep all persistence local to the device.

## Acceptance Criteria

- Saved categories persist after app reload.
- Saved account items persist after app reload.
- Saved settings persist after app reload.
- Saved monthly values persist after app reload.
- App can start when no saved data exists.
- Storage failures do not crash the app.
- No backup/restore is implemented in this task.

## Validation

Run:

```bash
npx tsc --noEmit
```

When applicable, run Expo and manually verify persistence by editing data, reloading, and checking that data remains.

## Documentation

Update README to mention local-only data storage behavior.
