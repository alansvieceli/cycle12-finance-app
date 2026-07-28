# Task 045-02 - Replace Monthly Values Atomically

Status: Done

## Spec

`docs/specs/045-monthly-value-list-import.md`

## Plan

`docs/plans/045-monthly-value-list-import-plan.md`

## Goal

Add one pure state transformation and one hook action that replace all parsed values for one account in a single state update.

## Files

- Modify: `src/hooks/useFinanceState.ts`
- Modify: `src/hooks/useFinanceState.test.ts`

## Interfaces

- Consumes: `MonthlyValueImportEntry` from task 045-01.
- Produces: `replaceMonthlyValuesForAccount(currentState, accountItemId, entries)` and `actions.replaceMonthlyValues(accountItemId, entries)`.

## Steps

- [x] **Step 1: Write the failing state tests**

In `src/hooks/useFinanceState.test.ts`, import `replaceMonthlyValuesForAccount` beside `buildAccountItemWithValueState`, then append:

```ts
describe('replaceMonthlyValuesForAccount', () => {
  const stateWithMonthlyValues = {
    ...baseState,
    accountItems: [
      {
        categoryId: 'cat-1',
        dueDay: 5,
        id: 'acc-1',
        name: 'Aluguel',
        sortOrder: 0,
      },
      {
        categoryId: 'cat-1',
        dueDay: 10,
        id: 'acc-2',
        name: 'Internet',
        sortOrder: 1,
      },
    ],
    monthlyValues: [
      { accountItemId: 'acc-1', amount: 100, month: 6 as const, year: 2026 },
      { accountItemId: 'acc-1', amount: 200, month: 7 as const, year: 2026 },
      { accountItemId: 'acc-1', amount: 300, month: 8 as const, year: 2026 },
      { accountItemId: 'acc-2', amount: 50, month: 6 as const, year: 2026 },
    ],
    paymentStatuses: [
      {
        accountItemId: 'acc-1',
        isPaid: false,
        isReviewed: true,
        month: 6 as const,
        year: 2026,
      },
    ],
  };

  it('replaces supplied months and creates missing values for one account', () => {
    const result = replaceMonthlyValuesForAccount(stateWithMonthlyValues, 'acc-1', [
      { amount: 125, month: 6, year: 2026 },
      { amount: 0, month: 7, year: 2026 },
      { amount: 450, month: 9, year: 2026 },
    ]);

    expect(result.monthlyValues).toEqual(
      expect.arrayContaining([
        { accountItemId: 'acc-1', amount: 125, month: 6, year: 2026 },
        { accountItemId: 'acc-1', amount: 0, month: 7, year: 2026 },
        { accountItemId: 'acc-1', amount: 300, month: 8, year: 2026 },
        { accountItemId: 'acc-1', amount: 450, month: 9, year: 2026 },
      ]),
    );
  });

  it('leaves other accounts, unsupplied months, and review marks untouched', () => {
    const result = replaceMonthlyValuesForAccount(stateWithMonthlyValues, 'acc-1', [
      { amount: 125, month: 6, year: 2026 },
    ]);

    expect(result.monthlyValues).toContainEqual({
      accountItemId: 'acc-1',
      amount: 200,
      month: 7,
      year: 2026,
    });
    expect(result.monthlyValues).toContainEqual({
      accountItemId: 'acc-2',
      amount: 50,
      month: 6,
      year: 2026,
    });
    expect(result.paymentStatuses).toBe(stateWithMonthlyValues.paymentStatuses);
  });
});
```

- [x] **Step 2: Run the tests to verify they fail**

Run: `npx jest useFinanceState`

Expected: FAIL because `replaceMonthlyValuesForAccount` is not exported.

- [x] **Step 3: Add the pure state transformation**

In `src/hooks/useFinanceState.ts`, add:

```ts
import type { MonthlyValueImportEntry } from '../lib/inputParsers';
```

After `buildAccountItemWithValueState`, add:

```ts
/** @internal */
export function replaceMonthlyValuesForAccount(
  currentState: FinanceState,
  accountItemId: string,
  entries: MonthlyValueImportEntry[],
): FinanceState {
  const replacedMonthKeys = new Set(
    entries.map(({ month, year }) => `${year}-${month}`),
  );
  const retainedValues = currentState.monthlyValues.filter(
    (monthlyValue) =>
      monthlyValue.accountItemId !== accountItemId ||
      !replacedMonthKeys.has(`${monthlyValue.year}-${monthlyValue.month}`),
  );

  return {
    ...currentState,
    monthlyValues: [
      ...retainedValues,
      ...entries.map((entry) => ({ ...entry, accountItemId })),
    ],
  };
}
```

Do not touch `paymentStatuses`; retaining the same array reference proves that import does not mark the account reviewed.

- [x] **Step 4: Add the hook action**

Inside `useFinanceState`, immediately after `updateMonthlyValue`, add:

```ts
  function replaceMonthlyValues(
    accountItemId: string,
    entries: MonthlyValueImportEntry[],
  ) {
    setFinanceState((currentState) =>
      replaceMonthlyValuesForAccount(currentState, accountItemId, entries),
    );
  }
```

Add `replaceMonthlyValues,` to the returned `actions` object immediately after `replaceFinanceState,`.

- [x] **Step 5: Run the focused tests**

Run: `npx jest useFinanceState`

Expected: PASS, including the existing account-creation cases.

- [x] **Step 6: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`

Expected: both commands pass with no warnings.

- [x] **Step 7: Commit**

```bash
git add src/hooks/useFinanceState.ts src/hooks/useFinanceState.test.ts
git commit -m "feat: replace monthly values atomically"
```

## Acceptance Criteria

- Supplied account/month values are replaced or created.
- Unsupplied months and other accounts are unchanged.
- Zero is stored as the imported full value.
- `paymentStatuses`, including `isReviewed`, are untouched.
- The hook exposes one bulk action backed by one functional state update.
- `npx jest useFinanceState`, `npm run typecheck`, and `npm run lint` pass.
