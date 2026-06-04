# Task 004-01 - Extract Formatting And Input Utils

## Plan Reference

`docs/plans/004-react-native-architecture-refactor-plan.md`

## Spec Reference

`docs/specs/004-react-native-architecture-refactor.md`

## Objective

Move pure formatting, parsing, clamping, and id helpers out of `App.tsx`.

## Steps

1. Create utility modules under `src/lib/`.
2. Move currency formatting and parsing helpers.
3. Move month label formatting helper.
4. Move due day parsing/clamping helper.
5. Move visible month count clamping helper if needed.
6. Move id creation helper.
7. Add focused unit tests for moved pure utilities.
8. Update imports in `App.tsx`.

## Acceptance Criteria

- `App.tsx` no longer defines formatting/parsing/id helper functions.
- Pure utilities live in `src/lib/`.
- Utility tests cover currency parsing, due day parsing, month count clamping, and id shape.
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
