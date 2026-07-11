import type { FinanceState } from '../types/finance';

/** Builds the canonical sample finance state used by storage and backup tests. */
export function buildSampleFinanceState(
  settingsOverrides: Partial<FinanceState['settings']> = {},
): FinanceState {
  return {
    accountItems: [
      {
        categoryId: 'category-fixed',
        dueDay: 10,
        id: 'account-rent',
        name: 'Aluguel',
        sortOrder: 0,
      },
    ],
    categories: [
      {
        id: 'category-fixed',
        name: 'Fixos',
        propagation: 'zero',
        sortOrder: 0,
      },
    ],
    monthHistory: [],
    monthlyValues: [
      {
        accountItemId: 'account-rent',
        amount: 1200,
        month: 6,
        year: 2026,
      },
    ],
    paymentStatuses: [
      {
        accountItemId: 'account-rent',
        isPaid: true,
        month: 6,
        year: 2026,
      },
    ],
    settings: {
      commitmentDangerThreshold: 80,
      commitmentWarningThreshold: 60,
      commitmentGoal: 70,
      currentMonthExtraBalance: 250,
      monthlySalary: 5000,
      summaryVisibleMonthCount: 12,
      windowStartMonth: 6,
      windowStartYear: 2026,
      ...settingsOverrides,
    },
  };
}
