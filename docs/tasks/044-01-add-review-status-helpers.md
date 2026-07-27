# Task 044-01 - Add Review Status Helpers

Status: Done

## Spec

`docs/specs/044-account-review-mark.md`

## Plan

`docs/plans/044-account-review-mark-plan.md`

## Goal

Add the `isReviewed` field to the per-account monthly record and the two pure helpers that read and toggle it, with unit tests.

## Files

- Modify: `src/types/finance.ts:40-45`
- Modify: `src/lib/financeCalculations.ts:199-215`
- Modify: `src/lib/financeCalculations.test.ts`

## Interfaces

- Consumes: `MonthlyPaymentStatus`, `ProjectionMonth` (both already exist).
- Produces: `isAccountItemReviewed(paymentStatuses, accountItemId, projectionMonth): boolean` and `toggleAccountReview(paymentStatuses, accountItemId, projectionMonth): MonthlyPaymentStatus[]`, both exported from `src/lib/financeCalculations.ts`.

## Steps

- [x] **Step 1: Write the failing tests**

In `src/lib/financeCalculations.test.ts`, add both names to the existing import from `./financeCalculations`, and add these cases inside the existing `describe('finance calculations', ...)` block, after the `'resolves a category name and falls back to a dash'` test:

```ts
  it('reads the review mark for the account and month', () => {
    const paymentStatuses = [
      { accountItemId: 'nubank', isPaid: false, isReviewed: true, month: 6 as const, year: 2026 },
      { accountItemId: 'rent', isPaid: true, month: 6 as const, year: 2026 },
    ];

    expect(isAccountItemReviewed(paymentStatuses, 'nubank', { month: 6, year: 2026 })).toBe(true);
    expect(isAccountItemReviewed(paymentStatuses, 'rent', { month: 6, year: 2026 })).toBe(false);
    expect(isAccountItemReviewed(paymentStatuses, 'nubank', { month: 7, year: 2026 })).toBe(false);
    expect(isAccountItemReviewed([], 'nubank', { month: 6, year: 2026 })).toBe(false);
  });

  it('creates an unpaid reviewed record when the account has no status yet', () => {
    expect(toggleAccountReview([], 'nubank', { month: 6, year: 2026 })).toEqual([
      { accountItemId: 'nubank', isPaid: false, isReviewed: true, month: 6, year: 2026 },
    ]);
  });

  it('flips the review mark without touching the paid state or other records', () => {
    const paymentStatuses = [
      { accountItemId: 'nubank', isPaid: true, isReviewed: true, month: 6 as const, year: 2026 },
      { accountItemId: 'rent', isPaid: true, month: 6 as const, year: 2026 },
    ];

    expect(toggleAccountReview(paymentStatuses, 'nubank', { month: 6, year: 2026 })).toEqual([
      { accountItemId: 'nubank', isPaid: true, isReviewed: false, month: 6, year: 2026 },
      { accountItemId: 'rent', isPaid: true, month: 6, year: 2026 },
    ]);
  });
```

- [x] **Step 2: Run the tests to verify they fail**

Run: `npx jest financeCalculations`
Expected: FAIL — `isAccountItemReviewed` and `toggleAccountReview` are not exported.

- [x] **Step 3: Add the optional field**

In `src/types/finance.ts`, replace the `MonthlyPaymentStatus` type:

```ts
/** Monthly status of an account: whether it was paid and whether its value was reviewed. */
export type MonthlyPaymentStatus = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  isPaid: boolean;
  isReviewed?: boolean;
};
```

- [x] **Step 4: Add the helpers on a shared finder**

In `src/lib/financeCalculations.ts`, replace the existing `isAccountItemPaid` with the block below. The private `findMonthlyStatus` exists so the same lookup is not written three times — the duplication policy applies to this file too.

```ts
function findMonthlyStatus(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): MonthlyPaymentStatus | undefined {
  return paymentStatuses.find(
    (paymentStatus) =>
      paymentStatus.accountItemId === accountItemId &&
      paymentStatus.month === projectionMonth.month &&
      paymentStatus.year === projectionMonth.year,
  );
}

export function isAccountItemPaid(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): boolean {
  return (
    findMonthlyStatus(paymentStatuses, accountItemId, projectionMonth)?.isPaid ?? false
  );
}

export function isAccountItemReviewed(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): boolean {
  return (
    findMonthlyStatus(paymentStatuses, accountItemId, projectionMonth)?.isReviewed ??
    false
  );
}

export function toggleAccountReview(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): MonthlyPaymentStatus[] {
  const existingStatus = findMonthlyStatus(
    paymentStatuses,
    accountItemId,
    projectionMonth,
  );

  if (!existingStatus) {
    return [
      ...paymentStatuses,
      {
        accountItemId,
        isPaid: false,
        isReviewed: true,
        month: projectionMonth.month,
        year: projectionMonth.year,
      },
    ];
  }

  return paymentStatuses.map((paymentStatus) =>
    paymentStatus === existingStatus
      ? { ...paymentStatus, isReviewed: !paymentStatus.isReviewed }
      : paymentStatus,
  );
}
```

Check the existing `isAccountItemPaid` body before replacing it: it returned `?.isPaid ?? false`. The refactor must keep that exact result, including `false` for a missing record.

- [x] **Step 5: Run the tests to verify they pass**

Run: `npx jest financeCalculations`
Expected: PASS, including the pre-existing paid/summary cases that now go through `findMonthlyStatus`.

- [x] **Step 6: Typecheck**

Run: `npm run typecheck && npm run lint`
Expected: clean.

- [x] **Step 7: Commit**

```bash
git add src/types/finance.ts src/lib/financeCalculations.ts src/lib/financeCalculations.test.ts
git commit -m "feat: add account review status helpers"
```

## Acceptance Criteria

- `MonthlyPaymentStatus` has an optional `isReviewed` and a comment saying the record covers both flags.
- `isAccountItemReviewed` returns `false` for a missing record, a record without the field, another month, or another account.
- `toggleAccountReview` creates `{ isPaid: false, isReviewed: true }` when no record exists, flips `isReviewed` when one does, and leaves `isPaid` and every other record untouched.
- `isAccountItemPaid` behaves exactly as before.
- `npx jest financeCalculations`, `npm run typecheck`, and `npm run lint` pass.
