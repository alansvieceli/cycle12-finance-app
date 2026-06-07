# Task 030-02 - Add History Capture to Window Advance

Status: Pending

## Spec

`docs/specs/030-month-history.md`

## Plan

`docs/plans/030-month-history-plan.md`

## Goal

Capture a `MonthHistoryEntry` snapshot inside `advanceWindowOneStep` in `src/lib/windowAdvance.ts` before the oldest month's records are dropped, and add unit tests covering the capture logic.

## Files

- Modify: `src/lib/windowAdvance.ts`
- Modify: `src/lib/windowAdvance.test.ts`

## Steps

1. In `src/lib/windowAdvance.ts`, import `MonthHistoryEntry` from `../types/finance`.

2. Add the `buildHistoryEntry` helper function after `advanceWindowOneStep`:

```ts
const MAX_HISTORY_ENTRIES = 12;

function buildHistoryEntry(
  state: FinanceState,
  oldestMonth: MonthReference,
): MonthHistoryEntry {
  const accountAmounts = state.accountItems.map((accountItem) => {
    const value = state.monthlyValues.find(
      (v) =>
        v.accountItemId === accountItem.id &&
        v.month === oldestMonth.month &&
        v.year === oldestMonth.year,
    );
    return { accountItem, amount: value?.amount ?? 0 };
  });

  const categoryMap = new Map(state.categories.map((c) => [c.id, c]));

  const categoryTotals = new Map<string, number>();
  for (const { accountItem, amount } of accountAmounts) {
    const prev = categoryTotals.get(accountItem.categoryId) ?? 0;
    categoryTotals.set(accountItem.categoryId, prev + amount);
  }

  const categories = Array.from(categoryTotals.entries()).map(([id, total]) => {
    const category = categoryMap.get(id);
    return {
      id,
      name: category?.name ?? id,
      color: category?.color,
      total,
    };
  });

  const accounts = accountAmounts.map(({ accountItem, amount }) => ({
    id: accountItem.id,
    name: accountItem.name,
    categoryId: accountItem.categoryId,
    amount,
  }));

  const totalExpenses = accountAmounts.reduce((sum, { amount }) => sum + amount, 0);

  return {
    month: oldestMonth.month,
    year: oldestMonth.year,
    totalIncome: state.settings.monthlySalary + state.settings.currentMonthExtraBalance,
    totalExpenses,
    categories,
    accounts,
  };
}
```

3. Update `advanceWindowOneStep` to capture history before dropping the oldest month:

```ts
function advanceWindowOneStep(state: FinanceState): FinanceState {
  const oldestMonth = {
    year: state.settings.windowStartYear,
    month: state.settings.windowStartMonth,
  };
  const nextWindowStart = addMonths(oldestMonth, 1);
  const newTrailingMonth = addMonths(oldestMonth, WINDOW_MONTH_COUNT);
  const monthlyValuesWithoutOldest = state.monthlyValues.filter(
    (monthlyValue) => !isSameMonth(monthlyValue, oldestMonth),
  );

  const historyEntry = buildHistoryEntry(state, oldestMonth);
  const updatedHistory = [historyEntry, ...(state.monthHistory ?? [])].slice(
    0,
    MAX_HISTORY_ENTRIES,
  );

  return {
    ...state,
    monthHistory: updatedHistory,
    monthlyValues: [
      ...monthlyValuesWithoutOldest,
      ...buildTrailingMonthValues(
        state.categories,
        state.accountItems,
        monthlyValuesWithoutOldest,
        newTrailingMonth,
      ),
    ],
    paymentStatuses: state.paymentStatuses.filter(
      (paymentStatus) => !isSameMonth(paymentStatus, oldestMonth),
    ),
    settings: {
      ...state.settings,
      windowStartYear: nextWindowStart.year,
      windowStartMonth: nextWindowStart.month,
    },
  };
}
```

4. In `src/lib/windowAdvance.test.ts`, update `baseState` to include `monthHistory: []` (required now that `FinanceState` has this field) and add the following tests inside the existing `describe('windowAdvance', ...)` block:

```ts
it('captures a history entry before dropping the oldest month', () => {
  const advancedState = advanceWindow(baseState, 2026, 7);

  expect(advancedState.monthHistory).toHaveLength(1);
  expect(advancedState.monthHistory[0]).toMatchObject({
    month: 6,
    year: 2026,
  });
});

it('captures totalIncome as salary plus extra balance', () => {
  const stateWithExtra = {
    ...baseState,
    settings: {
      ...baseState.settings,
      monthlySalary: 3000,
      currentMonthExtraBalance: 500,
    },
  };
  const advancedState = advanceWindow(stateWithExtra, 2026, 7);

  expect(advancedState.monthHistory[0].totalIncome).toBe(3500);
});

it('captures totalExpenses as the sum of all account values for that month', () => {
  const advancedState = advanceWindow(baseState, 2026, 7);

  // rent 900 + card 300 + loan 150 = 1350
  expect(advancedState.monthHistory[0].totalExpenses).toBe(1350);
});

it('captures per-category totals correctly', () => {
  const advancedState = advanceWindow(baseState, 2026, 7);
  const entry = advancedState.monthHistory[0];

  const fixedCategory = entry.categories.find((c) => c.id === 'fixed');
  expect(fixedCategory?.total).toBe(900);

  const zeroCategory = entry.categories.find((c) => c.id === 'zero');
  expect(zeroCategory?.total).toBe(300);
});

it('snapshots category and account names at advance time', () => {
  const advancedState = advanceWindow(baseState, 2026, 7);
  const entry = advancedState.monthHistory[0];

  expect(entry.categories.find((c) => c.id === 'fixed')?.name).toBe('Fixos');
  expect(entry.accounts.find((a) => a.id === 'rent')?.name).toBe('Aluguel');
});

it('caps monthHistory at 12 entries after multiple advances', () => {
  // baseState starts at Jun 2026; advancing to Aug 2027 = 14 advance steps
  const advancedState = advanceWindow(baseState, 2027, 8);

  expect(advancedState.monthHistory).toHaveLength(12);
});

it('drops the oldest history entry when the cap is exceeded', () => {
  // 14 advances: Jun 2026 through Jul 2026 are beyond the 12-entry cap
  const advancedState = advanceWindow(baseState, 2027, 8);
  const entries = advancedState.monthHistory.map((e) => ({
    month: e.month,
    year: e.year,
  }));

  expect(entries).not.toContainEqual({ month: 6, year: 2026 });
  expect(entries).not.toContainEqual({ month: 7, year: 2026 });
});
```

5. Run `npm test -- windowAdvance` and confirm all tests pass.

6. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `advanceWindowOneStep` captures a `MonthHistoryEntry` before dropping the oldest month.
- `totalIncome` equals `monthlySalary + currentMonthExtraBalance` from settings at advance time.
- `totalExpenses` equals the sum of all account `MonthlyValue` amounts for that month.
- Per-category totals are computed correctly.
- Category and account names are snapshots of values at advance time.
- `monthHistory` is prepended (most-recent first) and capped at 12 entries.
- Oldest entries beyond 12 are dropped.
- All unit tests pass.
- TypeScript compilation passes.
