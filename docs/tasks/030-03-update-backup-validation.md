# Task 030-03 - Update Backup Validation

Status: Pending

## Spec

`docs/specs/030-month-history.md`

## Plan

`docs/plans/030-month-history-plan.md`

## Goal

Update `validateFinanceState` in `src/lib/financeBackup.ts` to include `monthHistory` in backup/restore, and add a test covering that history survives a backup round-trip.

## Files

- Modify: `src/lib/financeBackup.ts`
- Modify: `src/lib/financeBackup.test.ts`

## Steps

1. In `src/lib/financeBackup.ts`, import `MonthHistoryEntry` from `../types/finance`.

2. Add a `validateMonthHistory` function. Because `monthHistory` is display-only and must not block a restore on format changes, treat any invalid or missing value as `[]`:

```ts
function validateMonthHistory(value: unknown): MonthHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: MonthHistoryEntry[] = [];

  for (const entry of value) {
    if (!isRecord(entry)) continue;

    const month = typeof entry.month === 'number' ? entry.month : null;
    const year = typeof entry.year === 'number' ? entry.year : null;
    const totalIncome =
      typeof entry.totalIncome === 'number' ? entry.totalIncome : null;
    const totalExpenses =
      typeof entry.totalExpenses === 'number' ? entry.totalExpenses : null;

    if (
      month === null ||
      year === null ||
      totalIncome === null ||
      totalExpenses === null ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      continue;
    }

    const categories = Array.isArray(entry.categories)
      ? entry.categories
          .filter(isRecord)
          .filter(
            (c) =>
              typeof c.id === 'string' &&
              typeof c.name === 'string' &&
              typeof c.total === 'number',
          )
          .map((c) => ({
            id: c.id as string,
            name: c.name as string,
            color: typeof c.color === 'string' ? c.color : undefined,
            total: c.total as number,
          }))
      : [];

    const accounts = Array.isArray(entry.accounts)
      ? entry.accounts
          .filter(isRecord)
          .filter(
            (a) =>
              typeof a.id === 'string' &&
              typeof a.name === 'string' &&
              typeof a.categoryId === 'string' &&
              typeof a.amount === 'number',
          )
          .map((a) => ({
            id: a.id as string,
            name: a.name as string,
            categoryId: a.categoryId as string,
            amount: a.amount as number,
          }))
      : [];

    result.push({
      month: month as MonthNumber,
      year,
      totalIncome,
      totalExpenses,
      categories,
      accounts,
    });
  }

  return result;
}
```

3. Update `validateFinanceState` to call `validateMonthHistory` and include the result:

```ts
function validateFinanceState(value: unknown): FinanceState {
  if (!isRecord(value)) {
    throw new BackupValidationError('Dados financeiros inválidos.');
  }

  const settings = validateSettings(value.settings);
  const categories = validateCategories(value.categories);
  const categoryIds = new Set(categories.map((category) => category.id));
  const accountItems = validateAccountItems(value.accountItems, categoryIds);
  const accountItemIds = new Set(accountItems.map((accountItem) => accountItem.id));
  const monthlyValues = validateMonthlyValues(value.monthlyValues, accountItemIds);
  const paymentStatuses = validatePaymentStatuses(
    value.paymentStatuses,
    accountItemIds,
  );
  const monthHistory = validateMonthHistory(value.monthHistory);

  return normalizeFinanceState({
    accountItems,
    categories,
    monthHistory,
    monthlyValues,
    paymentStatuses,
    settings,
  });
}
```

4. In `src/lib/financeBackup.test.ts`, add a test verifying that a `monthHistory` entry survives a backup round-trip. Find the existing test that calls `createBackupEnvelope` and `parseAndValidateBackupContent`, and update the `financeState` fixture to include one history entry:

```ts
const historyEntry: MonthHistoryEntry = {
  month: 5,
  year: 2026,
  totalIncome: 3500,
  totalExpenses: 1200,
  categories: [{ id: 'cat1', name: 'Fixos', total: 1200 }],
  accounts: [{ id: 'acc1', name: 'Aluguel', categoryId: 'cat1', amount: 1200 }],
};

// include monthHistory: [historyEntry] in the financeState fixture passed to createBackupEnvelope
```

Then assert that the restored state has `monthHistory` with the same entry:

```ts
expect(restoredState.monthHistory).toHaveLength(1);
expect(restoredState.monthHistory[0]).toMatchObject({
  month: 5,
  year: 2026,
  totalIncome: 3500,
});
```

5. Add a test verifying that a backup with missing `monthHistory` restores without error and returns `monthHistory: []`:

```ts
it('restores monthHistory as empty array when field is absent', async () => {
  // build a backup envelope with a financeState that has no monthHistory field
  const stateWithoutHistory = { ...validFinanceState };
  delete (stateWithoutHistory as Record<string, unknown>).monthHistory;
  // ... create envelope, serialize, parse, assert monthHistory is []
  expect(restoredState.monthHistory).toEqual([]);
});
```

6. Run `npm test -- financeBackup` and confirm all tests pass.

7. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `validateMonthHistory` accepts valid history arrays and returns typed `MonthHistoryEntry[]`.
- Invalid or missing `monthHistory` in a backup restores as `[]` without throwing.
- A valid `monthHistory` entry survives a backup round-trip intact.
- All backup tests pass.
- TypeScript compilation passes.
