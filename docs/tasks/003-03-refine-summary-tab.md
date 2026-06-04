# Task 003-03 - Refine Summary Tab

## Plan Reference

`docs/plans/003-tabbed-finance-workflow-plan.md`

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Prerequisite

Tasks `003-01` and `003-02` must be complete.

## Objective

Make `Resumo` a clean read-only financial summary.

## Steps

1. Show only the configured number of visible months.
2. Highlight the current month.
3. Show total expenses, salary commitment, and surplus/shortfall clearly.
4. Show category totals without edit controls.
5. Add helpful empty states when no data exists.

## Acceptance Criteria

- `Resumo` is read-only.
- `Resumo` respects visible month count.
- Current month is easy to identify.
- Empty state guides the user to configure categories/accounts.
- TypeScript validation passes.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
