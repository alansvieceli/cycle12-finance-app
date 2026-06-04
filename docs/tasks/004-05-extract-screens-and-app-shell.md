# Task 004-05 - Extract Screens And App Shell

## Plan Reference

`docs/plans/004-react-native-architecture-refactor-plan.md`

## Spec Reference

`docs/specs/004-react-native-architecture-refactor.md`

## Prerequisite

Tasks `004-01` through `004-04` must be complete.

## Objective

Extract screen-level components and reduce `App.tsx` to a small root component.

## Steps

1. Create `src/screens/`.
2. Extract `SummaryScreen`.
3. Extract `PlanningScreen`.
4. Extract `CategoriesScreen`.
5. Extract `SettingsScreen`.
6. Create an app shell component if helpful.
7. Reduce `App.tsx` to root composition.

## Acceptance Criteria

- `App.tsx` is under 80 lines.
- `App.tsx` does not define screen UI sections directly.
- Screen components live in `src/screens/`.
- Existing behavior remains intact.
- TypeScript validation passes.
- Tests pass.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
