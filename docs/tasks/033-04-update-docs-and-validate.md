# Task 033-04 - Update Docs and Validate

Status: Pending

## Spec

`docs/specs/033-salary-distribution-panel.md`

## Plan

`docs/plans/033-salary-distribution-panel-plan.md`

## Goal

Document the new "Onde vai o salário" panel in `docs/app-context.md` and run the full validation suite for spec 033.

## Files

- Modify: `docs/app-context.md`

## Steps

1. In `docs/app-context.md`, under `## Tab Responsibilities` → `### Resumo`, add a bullet to the existing list (after the "+", before "past month history" bullet, or wherever reads naturally) describing the new panel:

```md
- a "Onde vai o salário" panel showing how the current month's available income is distributed across categories, with a leftover/over-budget indicator and an expandable per-category breakdown.
```

The updated list should read (showing context):

```md
It shows:

- projected balance.
- salary commitment percentage and progress.
- monthly expense, paid, pending, and next due information when available.
- compact monthly summaries.
- a shortcut to current-month payment tracking.
- a "+" button on the balance panel for quickly adding an extra amount to the current month income.
- a "Onde vai o salário" panel showing how the current month's available income is distributed across categories, with a leftover/over-budget indicator and an expandable per-category breakdown.
- past month history accessible through the Histórico pill, showing income vs expenses cards with category and account breakdown.
```

2. Run the full validation suite:

```sh
npm run lint
npm run format:check
npx tsc --noEmit
npm test
npm run test:coverage
```

- `src/lib/salaryDistribution.ts` must meet the `src/lib` coverage threshold (≥80%).
- The pre-existing `ActionButton.test.tsx` / `expo-asset` failure is a known environment issue and is not a regression to fix as part of this spec.

3. Update `docs/plans/033-salary-distribution-panel-plan.md` Status to `Done` once all tasks 033-01 through 033-04 are complete.

## Acceptance Criteria

- `docs/app-context.md` describes the new "Onde vai o salário" panel under `Resumo`.
- `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm test`, and `npm run test:coverage` all pass (excluding the pre-existing `expo-asset` failure).
- `src/lib/salaryDistribution.ts` meets the project's `src/lib` coverage threshold.
- Plan 033 status updated to `Done`.
