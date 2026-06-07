# Task 030-01 - Update Data Model

Status: Pending

## Spec

`docs/specs/030-month-history.md`

## Plan

`docs/plans/030-month-history-plan.md`

## Goal

Add the `MonthHistoryEntry` type to `src/types/finance.ts`, extend `FinanceState` and `emptyFinanceState` with `monthHistory`, and handle missing `monthHistory` in storage migration.

## Files

- Modify: `src/types/finance.ts`
- Modify: `src/storage/financeStorage.ts`
- Modify: `src/lib/financeBackup.ts`

## Steps

1. In `src/types/finance.ts`, add the `MonthHistoryEntry` type after the `MonthlyPaymentStatus` type:

```ts
export type MonthHistoryEntry = {
  month: MonthNumber;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  categories: {
    id: string;
    name: string;
    color?: string;
    total: number;
  }[];
  accounts: {
    id: string;
    name: string;
    categoryId: string;
    amount: number;
  }[];
};
```

2. In `src/types/finance.ts`, add `monthHistory` to `FinanceState`:

```ts
export type FinanceState = {
  settings: FinanceSettings;
  categories: Category[];
  accountItems: AccountItem[];
  monthlyValues: MonthlyValue[];
  paymentStatuses: MonthlyPaymentStatus[];
  monthHistory: MonthHistoryEntry[];
};
```

3. In `src/types/finance.ts`, add `monthHistory: []` to `emptyFinanceState`:

```ts
export const emptyFinanceState: FinanceState = {
  settings: {
    ...createDefaultFinanceSettings(),
  },
  categories: [],
  accountItems: [],
  monthlyValues: [],
  paymentStatuses: [],
  monthHistory: [],
};
```

4. In `src/storage/financeStorage.ts`, update `normalizeFinanceState` to handle missing `monthHistory` from older stored data:

```ts
export function normalizeFinanceState(financeState: FinanceState): FinanceState {
  return {
    ...financeState,
    categories: financeState.categories.map(normalizeCategory),
    monthHistory: Array.isArray(financeState.monthHistory)
      ? financeState.monthHistory
      : [],
    paymentStatuses: financeState.paymentStatuses ?? [],
    settings: normalizeSettings(financeState.settings),
  };
}
```

5. In `src/lib/financeBackup.ts`, add `monthHistory: []` to `buildResetFinanceState`:

```ts
export function buildResetFinanceState(): FinanceState {
  // existing code ...
  return {
    accountItems: [],
    categories: [
      /* ... */
    ],
    monthHistory: [],
    monthlyValues: [],
    paymentStatuses: [],
    settings: {
      /* ... */
    },
  };
}
```

6. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `MonthHistoryEntry` type is exported from `src/types/finance.ts`.
- `FinanceState` includes `monthHistory: MonthHistoryEntry[]`.
- `emptyFinanceState` has `monthHistory: []`.
- `normalizeFinanceState` normalizes missing `monthHistory` to `[]`.
- `buildResetFinanceState` includes `monthHistory: []`.
- TypeScript compilation passes with no errors.
