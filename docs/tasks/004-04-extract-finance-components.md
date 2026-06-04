# Task 004-04 - Extract Finance Components

## Plan Reference

`docs/plans/004-react-native-architecture-refactor-plan.md`

## Spec Reference

`docs/specs/004-react-native-architecture-refactor.md`

## Prerequisite

Tasks `004-01` through `004-03` must be complete.

## Objective

Extract finance-specific display and editor components.

## Steps

1. Create `src/components/finance/`.
2. Extract month summary card.
3. Extract category total list.
4. Extract category editor.
5. Extract account editor.
6. Extract monthly value editor.
7. Extract settings form if it is finance-specific.

## Acceptance Criteria

- Finance-specific UI is not implemented directly in `App.tsx`.
- Extracted components receive data/actions via props.
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
