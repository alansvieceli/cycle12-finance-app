# Task 003-06 - Update Docs And Validate

## Plan Reference

`docs/plans/003-tabbed-finance-workflow-plan.md`

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Prerequisite

Tasks `003-01` through `003-05` must be complete.

## Objective

Update documentation and run final validation for the tabbed workflow.

## Steps

1. Update README with tabbed app behavior.
2. Run TypeScript validation.
3. Run tests.
4. Run Expo start validation when applicable.
5. Confirm the app opens on Android.

## Acceptance Criteria

- README reflects the tabbed workflow.
- TypeScript validation passes.
- Tests pass.
- Expo starts without crashing.
- App opens on Android.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

When applicable, run:

```bash
npx expo start
```
