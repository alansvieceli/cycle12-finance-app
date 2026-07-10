# Task 038-01 - Add Account Balance Helper

Status: Done (commit pending confirmation)

## Spec

`docs/specs/038-account-balance-reconciliation.md`

## Plan

`docs/plans/038-account-balance-reconciliation-plan.md`

## Goal

Add a pure `calculateAccountBalance` helper (`Recebido − Pago`) to `financeCalculations.ts`, with unit tests. This is the value that will back the new "Saldo em conta" KPI.

## Files

- Modify: `src/lib/financeCalculations.ts:136-145`
- Modify: `src/lib/financeCalculations.test.ts`

## Steps

- [x] **Step 1: Write the failing test**

Add to `src/lib/financeCalculations.test.ts`, inside the existing `describe('finance calculations', ...)` block, right after the `'includes extra balance only for the current month surplus calculation'` test (currently ending around line 148):

```ts
it('calculates the account balance as available income minus total paid', () => {
  expect(calculateAccountBalance(5000, 1800)).toBe(3200);
  expect(calculateAccountBalance(1800, 1800)).toBe(0);
  expect(calculateAccountBalance(1000, 1800)).toBe(-800);
});
```

Add `calculateAccountBalance` to the existing import list at the top of the file:

```ts
import {
  calculateAccountBalance,
  calculateCategoryTotal,
  calculateCategoryTotals,
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  calculatePaymentSummary,
  calculateSalaryCommitmentPercentage,
  calculateSurplusOrShortfall,
  createProjectionMonths,
} from './financeCalculations';
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest financeCalculations -t "calculates the account balance"`
Expected: FAIL — `calculateAccountBalance` is not exported / not defined.

- [x] **Step 3: Write minimal implementation**

In `src/lib/financeCalculations.ts`, insert this new function right after `calculateSurplusOrShortfall` (which ends at line 144) and before `calculatePaymentSummary` (which starts at line 146):

```ts
export function calculateAccountBalance(
  availableIncome: number,
  totalPaid: number,
): number {
  return availableIncome - totalPaid;
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx jest financeCalculations -t "calculates the account balance"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/financeCalculations.ts src/lib/financeCalculations.test.ts
git commit -m "feat: add calculateAccountBalance helper"
```

## Acceptance Criteria

- `calculateAccountBalance(availableIncome, totalPaid)` is exported from `src/lib/financeCalculations.ts` and returns `availableIncome - totalPaid`.
- Unit tests cover positive, zero, and negative results.
- `npx tsc --noEmit` passes.
- `npm test` passes.
