# Task 031-03 - Update Docs and Validate

Status: Completed

## Spec

`docs/specs/031-quick-add-extra-balance.md`

## Plan

`docs/plans/031-quick-add-extra-balance-plan.md`

## Goal

Update `docs/app-context.md` to reflect the new quick-add entry point and the auto-reset behavior, then run full validation.

## Files

- Modify: `docs/app-context.md`

## Steps

- [ ] **Step 1: Update `docs/app-context.md`**

In the **Core Data Concepts** section, update the `Current month extra balance` entry to:

```
- Current month extra balance: an extra amount that affects the current month projection. Added quickly via the "+" button in the Resumo balance panel or edited directly in Ajustes. Resets to zero automatically when the planning window advances.
```

In the **Tab Responsibilities → Resumo** section, add one sentence to the "It shows:" list:

```
- a "+" button on the balance panel for quickly adding an extra amount to the current month income.
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add docs/app-context.md
git commit -m "docs: update app-context for quick extra balance feature"
```

## Acceptance Criteria

- `docs/app-context.md` describes the new "+" entry point and the auto-reset behavior.
- TypeScript compilation passes.
- All tests pass.
