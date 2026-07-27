# Task 043-01 - Share Category Name Helper

Status: Done

## Spec

`docs/specs/043-tab-review-cleanup.md`

## Plan

`docs/plans/043-tab-review-cleanup-plan.md`

## Goal

`getCategoryName` is declared verbatim in three components. Move it to `src/lib/financeCalculations.ts`, next to the other finance-state lookups, and delete the copies.

## Files

- Modify: `src/lib/financeCalculations.ts`
- Modify: `src/lib/financeCalculations.test.ts`
- Modify: `src/components/finance/MonthlyValueEditor.tsx`
- Modify: `src/components/finance/CurrentMonthPaymentChecklist.tsx`
- Modify: `src/components/finance/AccountEditor.tsx`

## Steps

- [x] **Step 1: Write the failing test**

In `financeCalculations.test.ts`, add `getCategoryName` to the import list and a case:

```ts
it('resolves a category name and falls back to a dash', () => {
  const categories = [{ id: 'cat-1', name: 'Moradia', propagation: 'zero' as const, sortOrder: 0 }];

  expect(getCategoryName(categories, 'cat-1')).toBe('Moradia');
  expect(getCategoryName(categories, 'missing')).toBe('-');
});
```

- [x] **Step 2: Add the shared helper**

In `src/lib/financeCalculations.ts`, right after `getMonthlyValueAmount`:

```ts
export function getCategoryName(categories: Category[], categoryId: string): string {
  return categories.find((category) => category.id === categoryId)?.name ?? '-';
}
```

- [x] **Step 3: Delete the copies**

Remove the local `getCategoryName` from `MonthlyValueEditor.tsx`, `CurrentMonthPaymentChecklist.tsx`, and `AccountEditor.tsx`, importing the shared one instead. `AccountEditor` needs a new `import { getCategoryName } from '../../lib/financeCalculations';`.

- [x] **Step 4: Validate**

```bash
npx jest financeCalculations && npm run typecheck
```

## Acceptance Criteria

- `getCategoryName` is exported from `src/lib/financeCalculations.ts` and declared nowhere else.
- The new test passes and `npm run typecheck` is clean.
