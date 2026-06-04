# Task 007-04 - Refine Summary Details Panel

## Plan Reference

`docs/plans/007-sorting-and-compact-management-panels-plan.md`

## Spec Reference

`docs/specs/007-sorting-and-compact-management-panels.md`

## Objective

Make `Resumo` easier to scan by moving month category totals into a details panel.

## Steps

1. Make month summary cards compact by default.
2. Add an action to open month details.
3. Add a month details panel with category totals directly below the selected month.
4. Use consistent sorting for category totals.
5. Add a `Pagamentos do mês` action that opens the current-month payment checklist in a panel.
6. Add a close/back action for the payment panel.

## Acceptance Criteria

- Month cards no longer show category totals by default.
- Month details can be opened and closed.
- Details include category totals for the selected month and appear below the selected month card.
- Current-month payment tracking opens and closes from a dedicated panel.
- Summary remains read-focused and compact.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
