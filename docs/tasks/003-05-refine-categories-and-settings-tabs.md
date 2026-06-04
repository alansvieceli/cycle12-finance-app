# Task 003-05 - Refine Categories And Settings Tabs

## Plan Reference

`docs/plans/003-tabbed-finance-workflow-plan.md`

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Prerequisite

Tasks `003-01` through `003-04` must be complete.

## Objective

Polish the `Categorias` and `Ajustes` tabs.

## Steps

1. Keep category creation/editing/deletion in `Categorias`.
2. Keep salary and current month extra balance in `Ajustes`.
3. Add visible month count editing in `Ajustes`.
4. Make the visible month count control easy to adjust from 1 to 12.
5. Keep storage status visible but unobtrusive.

## Acceptance Criteria

- `Categorias` manages only categories.
- `Ajustes` manages salary, extra balance, and visible month count.
- Visible month count can be changed from 1 to 12.
- Summary updates when visible month count changes.
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
