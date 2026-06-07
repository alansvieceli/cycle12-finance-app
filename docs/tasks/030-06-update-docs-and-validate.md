# Task 030-06 - Update Docs and Validate

Status: Pending

## Spec

`docs/specs/030-month-history.md`

## Plan

`docs/plans/030-month-history-plan.md`

## Goal

Update `docs/app-context.md` to reflect the new `monthHistory` data concept and Histórico view, then run full validation.

## Files

- Modify: `docs/app-context.md`

## Steps

1. In `docs/app-context.md`, under **Core Data Concepts**, add after the `Payment status` entry:

```
- Month history: a snapshot of each past month captured when the planning window advances, storing income, total expenses, and per-category/per-account breakdowns. Up to 12 entries are kept.
```

2. In `docs/app-context.md`, under **Tab Responsibilities → Resumo**, add after the existing list of what Resumo shows:

```
- past month history accessible through the Histórico pill, showing income vs expenses cards with category and account breakdown.
```

3. Run `npx tsc --noEmit` and confirm TypeScript passes with no errors.

4. Run `npm test` and confirm all tests pass.

## Acceptance Criteria

- `docs/app-context.md` documents the `monthHistory` data concept.
- `docs/app-context.md` documents the Histórico view in the Resumo tab responsibilities.
- `npx tsc --noEmit` exits with no errors.
- `npm test` exits with no failures.
