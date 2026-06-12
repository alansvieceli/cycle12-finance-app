import { advanceWindow, shouldAdvanceWindow } from './windowAdvance';
import { FinanceState } from '../types/finance';

const baseState: FinanceState = {
  accountItems: [
    {
      categoryId: 'fixed',
      dueDay: 10,
      id: 'rent',
      name: 'Aluguel',
      sortOrder: 0,
    },
    {
      categoryId: 'zero',
      dueDay: 12,
      id: 'card',
      name: 'Cartão',
      sortOrder: 0,
    },
    {
      categoryId: 'installment',
      dueDay: 15,
      id: 'loan',
      name: 'Empréstimo',
      sortOrder: 0,
    },
  ],
  categories: [
    {
      id: 'fixed',
      name: 'Fixos',
      propagation: 'fixed',
      sortOrder: 0,
    },
    {
      id: 'zero',
      name: 'Variáveis',
      propagation: 'zero',
      sortOrder: 1,
    },
    {
      id: 'installment',
      installmentEndDate: '2027-06-01',
      name: 'Parcelas',
      propagation: 'installment',
      sortOrder: 2,
    },
  ],
  monthHistory: [],
  monthlyValues: [
    { accountItemId: 'rent', amount: 900, month: 6, year: 2026 },
    { accountItemId: 'card', amount: 300, month: 6, year: 2026 },
    { accountItemId: 'loan', amount: 150, month: 6, year: 2026 },
    { accountItemId: 'rent', amount: 1000, month: 5, year: 2027 },
    { accountItemId: 'card', amount: 500, month: 5, year: 2027 },
    { accountItemId: 'loan', amount: 200, month: 5, year: 2027 },
  ],
  paymentStatuses: [
    { accountItemId: 'rent', isPaid: true, month: 6, year: 2026 },
    { accountItemId: 'card', isPaid: true, month: 7, year: 2026 },
  ],
  settings: {
    commitmentDangerThreshold: 90,
    commitmentGoal: 70,
    commitmentWarningThreshold: 80,
    currentMonthExtraBalance: 0,
    monthlySalary: 3000,
    summaryVisibleMonthCount: 12,
    windowStartMonth: 6,
    windowStartYear: 2026,
  },
};

describe('windowAdvance', () => {
  it('returns false when the window is current', () => {
    expect(shouldAdvanceWindow(2026, 6, 2026, 6)).toBe(false);
  });

  it('returns true when the current month is ahead by one month', () => {
    expect(shouldAdvanceWindow(2026, 6, 2026, 7)).toBe(true);
  });

  it('returns true when the current month is ahead by many months', () => {
    expect(shouldAdvanceWindow(2026, 6, 2027, 3)).toBe(true);
  });

  it('drops oldest month values and payment statuses', () => {
    const advancedState = advanceWindow(baseState, 2026, 7);

    expect(
      advancedState.monthlyValues.some(
        (monthlyValue) => monthlyValue.month === 6 && monthlyValue.year === 2026,
      ),
    ).toBe(false);
    expect(
      advancedState.paymentStatuses.some(
        (paymentStatus) => paymentStatus.month === 6 && paymentStatus.year === 2026,
      ),
    ).toBe(false);
    expect(advancedState.paymentStatuses).toContainEqual({
      accountItemId: 'card',
      isPaid: true,
      month: 7,
      year: 2026,
    });
  });

  it('fills new month with fixed propagation using the last known value', () => {
    const advancedState = advanceWindow(baseState, 2026, 7);

    expect(advancedState.monthlyValues).toContainEqual({
      accountItemId: 'rent',
      amount: 1000,
      month: 6,
      year: 2027,
    });
  });

  it('fills new month with zero propagation as zero', () => {
    const advancedState = advanceWindow(baseState, 2026, 7);

    expect(advancedState.monthlyValues).toContainEqual({
      accountItemId: 'card',
      amount: 0,
      month: 6,
      year: 2027,
    });
  });

  it('fills installment propagation using the last known value before end date', () => {
    const advancedState = advanceWindow(baseState, 2026, 7);

    expect(advancedState.monthlyValues).toContainEqual({
      accountItemId: 'loan',
      amount: 200,
      month: 6,
      year: 2027,
    });
  });

  it('fills installment propagation as zero after end date', () => {
    const stateAfterEndDate: FinanceState = {
      ...baseState,
      categories: baseState.categories.map((category) =>
        category.id === 'installment'
          ? { ...category, installmentEndDate: '2027-05-01' }
          : category,
      ),
    };
    const advancedState = advanceWindow(stateAfterEndDate, 2026, 7);

    expect(advancedState.monthlyValues).toContainEqual({
      accountItemId: 'loan',
      amount: 0,
      month: 6,
      year: 2027,
    });
  });

  it('advances multiple steps correctly', () => {
    const advancedState = advanceWindow(baseState, 2026, 9);

    expect(advancedState.settings.windowStartMonth).toBe(9);
    expect(advancedState.settings.windowStartYear).toBe(2026);
    expect(advancedState.monthlyValues).toContainEqual({
      accountItemId: 'rent',
      amount: 1000,
      month: 8,
      year: 2027,
    });
  });

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

  it('resets currentMonthExtraBalance to 0 when the window advances one step', () => {
    const stateWithExtra: FinanceState = {
      ...baseState,
      settings: {
        ...baseState.settings,
        currentMonthExtraBalance: 500,
      },
    };

    const advancedState = advanceWindow(stateWithExtra, 2026, 7);

    expect(advancedState.settings.currentMonthExtraBalance).toBe(0);
  });

  it('resets currentMonthExtraBalance to 0 even when advancing multiple steps', () => {
    const stateWithExtra: FinanceState = {
      ...baseState,
      settings: {
        ...baseState.settings,
        currentMonthExtraBalance: 1200,
      },
    };

    const advancedState = advanceWindow(stateWithExtra, 2026, 9);

    expect(advancedState.settings.currentMonthExtraBalance).toBe(0);
  });
});
