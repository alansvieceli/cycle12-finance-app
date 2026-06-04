# Task 004-02 - Extract Finance State Hook

## Plan Reference

`docs/plans/004-react-native-architecture-refactor-plan.md`

## Spec Reference

`docs/specs/004-react-native-architecture-refactor.md`

## Prerequisite

Task `004-01` must be complete.

## Objective

Move finance state, persistence, and update actions out of `App.tsx` into a custom hook.

## Steps

1. Create `src/hooks/useFinanceState.ts`.
2. Move local finance state initialization into the hook.
3. Move storage load/save effects into the hook.
4. Move category/account/settings/monthly value update actions into the hook.
5. Keep UI-only state such as active tab outside the finance state hook unless it belongs in the hook.
6. Update `App.tsx` to consume the hook.

## Acceptance Criteria

- `App.tsx` no longer owns finance state mutation functions.
- Storage load/save logic is not in `App.tsx`.
- The hook exposes finance state, selected account state, storage status, and update actions.
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
