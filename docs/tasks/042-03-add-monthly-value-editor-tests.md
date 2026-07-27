# Task 042-03 - Add Monthly Value Editor Tests

Status: Done

## Spec

`docs/specs/042-planejar-quality-cleanup.md`

## Plan

`docs/plans/042-planejar-quality-cleanup-plan.md`

## Goal

Add the first test suite for `MonthlyValueEditor`, the most stateful component in the app. The pure helpers it orchestrates are already covered; what is untested is the wiring — which month an adjustment targets, whether installments reach the callback, and whether `subtract` leaks an installment count.

## Files

- Create: `src/components/finance/MonthlyValueEditor.test.tsx`

## Steps

- [x] **Step 1: Build the fixture**

Local to the test file: one category, two account items, 12 months from `createProjectionMonths(new Date(2026, 6, 1))`, and monthly values for the first two months.

- [x] **Step 2: Write the cases**

1. Empty state: no `selectedAccountItem` renders `Crie uma categoria e uma conta para editar valores mensais.`
2. Rendering: 12 rows plus the footer total equal to the summed monthly values.
3. Inline edit: `changeText` on the first month input then `blur` calls `onChangeMonthlyValue` with that month and the parsed amount.
4. Add with installments: press `Ajustar valor` on the second row, type an amount, pick `3 meses`, confirm -> `onAdjustMonthlyValue(accountId, month2, amount, 'add', 3)`.
5. Subtract: press `Ajustar valor`, switch to `−`, type an amount, confirm -> `onAdjustMonthlyValue(accountId, month, amount, 'subtract', undefined)`.

The modal amount field is the last element matching the `0,00` placeholder — the 12 row inputs render before the modal in the tree. Comment this in the test so the index reads as intentional.

- [x] **Step 3: Run**

```bash
npx jest MonthlyValueEditor
```

## Acceptance Criteria

- `src/components/finance/MonthlyValueEditor.test.tsx` exists and covers the five cases.
- `npx jest MonthlyValueEditor` passes.
- No production file is changed by this task.
