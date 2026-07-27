import type {
  AccountItem,
  Category,
  FinanceSettings,
  MonthlyPaymentStatus,
  MonthlyValue,
} from '../types/finance';
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
  getCategoryName,
  isAccountItemReviewed,
  toggleAccountReview,
} from './financeCalculations';

const categories: Category[] = [
  {
    id: 'credit-card',
    name: 'Cartão de Crédito',
    propagation: 'zero',
    sortOrder: 1,
  },
  { id: 'home', name: 'Casa', propagation: 'zero', sortOrder: 2 },
];

const accountItems: AccountItem[] = [
  {
    id: 'nubank',
    categoryId: 'credit-card',
    name: 'Nubank',
    dueDay: 8,
    sortOrder: 1,
  },
  {
    id: 'santander',
    categoryId: 'credit-card',
    name: 'Santander',
    dueDay: 18,
    sortOrder: 2,
  },
  {
    id: 'power',
    categoryId: 'home',
    name: 'Luz',
    dueDay: 10,
    sortOrder: 1,
  },
];

const monthlyValues: MonthlyValue[] = [
  { accountItemId: 'nubank', month: 6, year: 2026, amount: 1200 },
  { accountItemId: 'santander', month: 6, year: 2026, amount: 800 },
  { accountItemId: 'power', month: 6, year: 2026, amount: 200 },
  { accountItemId: 'nubank', month: 7, year: 2026, amount: 500 },
];

describe('finance calculations', () => {
  it('generates up to 12 projection months from the current month', () => {
    expect(createProjectionMonths(new Date(2026, 10, 15), 3)).toEqual([
      { year: 2026, month: 11, key: '2026-11', isCurrentMonth: true },
      { year: 2026, month: 12, key: '2026-12', isCurrentMonth: false },
      { year: 2027, month: 1, key: '2027-01', isCurrentMonth: false },
    ]);
  });

  it('calculates category totals for a month', () => {
    expect(
      calculateCategoryTotal('credit-card', accountItems, monthlyValues, {
        month: 6,
        year: 2026,
      }),
    ).toBe(2000);

    expect(
      calculateCategoryTotals(categories, accountItems, monthlyValues, {
        month: 6,
        year: 2026,
      }),
    ).toEqual([
      { categoryId: 'credit-card', total: 2000 },
      { categoryId: 'home', total: 200 },
    ]);
  });

  it('calculates total expenses for a month', () => {
    expect(
      calculateMonthlyTotalExpenses(categories, accountItems, monthlyValues, {
        month: 6,
        year: 2026,
      }),
    ).toBe(2200);
  });

  it('calculates salary commitment percentage', () => {
    expect(calculateSalaryCommitmentPercentage(2200, 4400)).toBe(0.5);
    expect(calculateSalaryCommitmentPercentage(2200, 0)).toBeNull();
  });

  it('calculates commitment from available income for the projection month', () => {
    const settings: FinanceSettings = {
      monthlySalary: 3000,
      currentMonthExtraBalance: 1000,
      summaryVisibleMonthCount: 12,
      commitmentWarningThreshold: 80,
      commitmentDangerThreshold: 90,
      commitmentGoal: 70,
      windowStartMonth: 6,
      windowStartYear: 2026,
    };

    expect(
      calculateIncomeCommitmentPercentage(2000, settings, {
        isCurrentMonth: true,
      }),
    ).toBe(0.5);

    expect(
      calculateIncomeCommitmentPercentage(2100, settings, {
        isCurrentMonth: false,
      }),
    ).toBe(0.7);

    expect(
      calculateIncomeCommitmentPercentage(
        2000,
        { ...settings, monthlySalary: 0, currentMonthExtraBalance: 0 },
        { isCurrentMonth: true },
      ),
    ).toBeNull();
  });

  it('includes extra balance only for the current month surplus calculation', () => {
    const settings: FinanceSettings = {
      monthlySalary: 3000,
      currentMonthExtraBalance: 500,
      summaryVisibleMonthCount: 12,
      commitmentWarningThreshold: 80,
      commitmentDangerThreshold: 90,
      commitmentGoal: 70,
      windowStartMonth: 6,
      windowStartYear: 2026,
    };

    expect(calculateSurplusOrShortfall(settings, 3200, { isCurrentMonth: true })).toBe(
      300,
    );

    expect(calculateSurplusOrShortfall(settings, 3200, { isCurrentMonth: false })).toBe(
      -200,
    );
  });

  it('calculates the account balance as available income minus total paid', () => {
    expect(calculateAccountBalance(5000, 1800)).toBe(3200);
    expect(calculateAccountBalance(1800, 1800)).toBe(0);
    expect(calculateAccountBalance(1000, 1800)).toBe(-800);
  });

  it('resolves a category name and falls back to a dash', () => {
    expect(getCategoryName(categories, 'home')).toBe('Casa');
    expect(getCategoryName(categories, 'missing')).toBe('-');
  });

  it('reads the review mark for the account and month', () => {
    const paymentStatuses: MonthlyPaymentStatus[] = [
      {
        accountItemId: 'nubank',
        isPaid: false,
        isReviewed: true,
        month: 6,
        year: 2026,
      },
      { accountItemId: 'rent', isPaid: true, month: 6, year: 2026 },
    ];

    expect(
      isAccountItemReviewed(paymentStatuses, 'nubank', { month: 6, year: 2026 }),
    ).toBe(true);
    expect(
      isAccountItemReviewed(paymentStatuses, 'rent', { month: 6, year: 2026 }),
    ).toBe(false);
    expect(
      isAccountItemReviewed(paymentStatuses, 'nubank', { month: 7, year: 2026 }),
    ).toBe(false);
    expect(isAccountItemReviewed([], 'nubank', { month: 6, year: 2026 })).toBe(false);
  });

  it('creates an unpaid reviewed record when the account has no status yet', () => {
    expect(toggleAccountReview([], 'nubank', { month: 6, year: 2026 })).toEqual([
      {
        accountItemId: 'nubank',
        isPaid: false,
        isReviewed: true,
        month: 6,
        year: 2026,
      },
    ]);
  });

  it('flips the review mark without touching the paid state or other records', () => {
    const paymentStatuses: MonthlyPaymentStatus[] = [
      { accountItemId: 'nubank', isPaid: true, isReviewed: true, month: 6, year: 2026 },
      { accountItemId: 'rent', isPaid: true, month: 6, year: 2026 },
    ];

    expect(
      toggleAccountReview(paymentStatuses, 'nubank', { month: 6, year: 2026 }),
    ).toEqual([
      {
        accountItemId: 'nubank',
        isPaid: true,
        isReviewed: false,
        month: 6,
        year: 2026,
      },
      { accountItemId: 'rent', isPaid: true, month: 6, year: 2026 },
    ]);
  });

  it('calculates paid and pending totals for a month', () => {
    expect(
      calculatePaymentSummary(
        accountItems,
        monthlyValues,
        [
          {
            accountItemId: 'nubank',
            isPaid: true,
            month: 6,
            year: 2026,
          },
        ],
        { month: 6, year: 2026 },
      ),
    ).toEqual({
      totalPaid: 1200,
      totalPending: 1000,
    });
  });
});
