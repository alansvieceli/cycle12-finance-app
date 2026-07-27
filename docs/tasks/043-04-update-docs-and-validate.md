# Task 043-04 - Update Docs and Validate

Status: Done

## Spec

`docs/specs/043-tab-review-cleanup.md`

## Plan

`docs/plans/043-tab-review-cleanup-plan.md`

## Goal

Align the documentation with two behaviors it currently describes wrongly, then run the full quality gate for specs 042 and 043 together.

## Files

- Modify: `docs/app-context.md`
- Modify: `README.md`
- Modify: `docs/standards/ui-copy-policy.md`

## Steps

- [x] **Step 1: Tab name**

The fourth tab is labeled `Cadastros` in `FinanceApp.tsx`, not `Contas`. Update:

- `docs/app-context.md`: the Primary Navigation list and the tab section heading and body (`Contas` as a section name inside the tab stays correct).
- `README.md`: the bottom-navigation bullet.
- `docs/standards/ui-copy-policy.md`: the navigation-tab example list.

- [x] **Step 2: Month count range**

The `Ajustes` picker offers 3 to 12 months, not 1 to 12. Update the wording in `docs/app-context.md` and `README.md`. `clampVisibleMonthCount` still accepts 1–12 because it normalizes loaded and restored data, not user input — no code change.

- [x] **Step 3: Reset thresholds**

`README.md` says reset recreates a 60% warning and 80% danger threshold. `buildResetFinanceState` uses `createDefaultFinanceSettings`, which sets 70% and 90%. Correct the numbers.

- [x] **Step 4: Validate**

```bash
npm run check
```

## Acceptance Criteria

- No document describes a `Contas` tab in the bottom navigation.
- The month-count range reads 3 to 12 in `docs/app-context.md` and `README.md`.
- `npm run check` passes.
