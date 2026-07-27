# Task 042-01 - Reuse Monthly Value Helper

Status: Done

## Spec

`docs/specs/042-planejar-quality-cleanup.md`

## Plan

`docs/plans/042-planejar-quality-cleanup-plan.md`

## Goal

Delete the local `getMonthlyValueAmount` copy in `MonthlyValueEditor.tsx` and use the shared helper already exported from `src/lib/financeCalculations.ts`.

## Files

- Modify: `src/components/finance/MonthlyValueEditor.tsx`

## Steps

- [x] **Step 1: Import the shared helper**

Change the type-only import to a mixed import:

```ts
import {
  getMonthlyValueAmount,
  type ProjectionMonth,
} from '../../lib/financeCalculations';
```

- [x] **Step 2: Delete the local copy**

Remove the `getMonthlyValueAmount` function declared at the bottom of the file (currently lines 348-361). The three call sites (`annualTotal`, the row amount, `AdjustPanel.currentAmount`) need no change — the shared signature is `(monthlyValues, accountItemId, projectionMonth)`, identical to the deleted one.

- [x] **Step 3: Validate**

```bash
npm run typecheck && npm run lint
```

## Acceptance Criteria

- `MonthlyValueEditor.tsx` declares no `getMonthlyValueAmount` function.
- The helper is imported from `../../lib/financeCalculations`.
- `npm run typecheck` and `npm run lint` pass.
