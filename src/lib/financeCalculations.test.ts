import {
  calculateCategoryTotal,
  calculateCategoryTotals,
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  calculatePaymentSummary,
  calculateSalaryCommitmentPercentage,
  calculateSurplusOrShortfall,
  createProjectionMonths,
} from './financeCalculations';
import { AccountItem, Category, FinanceSettings, MonthlyValue } from '../types/finance';

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
