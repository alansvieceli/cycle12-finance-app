# Task 004-03 - Extract Common Components

## Plan Reference

`docs/plans/004-react-native-architecture-refactor-plan.md`

## Spec Reference

`docs/specs/004-react-native-architecture-refactor.md`

## Prerequisite

Tasks `004-01` and `004-02` must be complete.

## Objective

Extract reusable UI components shared across screens.

## Steps

1. Create `src/components/common/`.
2. Extract common button components.
3. Extract tab controls.
4. Extract panel/section layout component if useful.
5. Extract reusable currency input or field wrapper if useful.
6. Keep styling local to components unless shared tokens reduce duplication.

## Acceptance Criteria

- Common button/tab/input/panel UI is not implemented directly in `App.tsx`.
- Components are typed with simple props.
- No new UI dependency is added.
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
