import {
  AccountItem,
  Category,
  FinanceSettings,
  MonthNumber,
  MonthlyValue,
} from '../types/finance';

export type ProjectionMonth = {
  year: number;
  month: MonthNumber;
  key: string;
  isCurrentMonth: boolean;
};

export type CategoryMonthTotal = {
  categoryId: string;
  total: number;
};

export function createProjectionMonths(
  startDate: Date = new Date(),
  count = 12,
): ProjectionMonth[] {
  const safeCount = Math.max(0, Math.min(count, 12));
  const startYear = startDate.getFullYear();
  const startMonthIndex = startDate.getMonth();

  return Array.from({ length: safeCount }, (_, index) => {
    const date = new Date(startYear, startMonthIndex + index, 1);
    const month = (date.getMonth() + 1) as MonthNumber;
    const year = date.getFullYear();

    return {
      year,
      month,
      key: `${year}-${String(month).padStart(2, '0')}`,
      isCurrentMonth: index === 0,
    };
  });
}

export function calculateCategoryTotal(
  categoryId: string,
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): number {
  const categoryAccountIds = new Set(
    accountItems
      .filter((accountItem) => accountItem.categoryId === categoryId)
      .map((accountItem) => accountItem.id),
  );

  return monthlyValues
    .filter(
      (monthlyValue) =>
        categoryAccountIds.has(monthlyValue.accountItemId) &&
        monthlyValue.month === projectionMonth.month &&
        monthlyValue.year === projectionMonth.year,
    )
    .reduce((total, monthlyValue) => total + monthlyValue.amount, 0);
}

export function calculateCategoryTotals(
  categories: Category[],
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): CategoryMonthTotal[] {
  return categories.map((category) => ({
    categoryId: category.id,
    total: calculateCategoryTotal(
      category.id,
      accountItems,
      monthlyValues,
      projectionMonth,
    ),
  }));
}

export function calculateMonthlyTotalExpenses(
  categories: Category[],
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): number {
  return calculateCategoryTotals(
    categories,
    accountItems,
    monthlyValues,
    projectionMonth,
  ).reduce((total, categoryTotal) => total + categoryTotal.total, 0);
}

export function calculateSalaryCommitmentPercentage(
  monthlyTotalExpenses: number,
  monthlySalary: number,
): number | null {
  if (monthlySalary <= 0) {
    return null;
  }

  return monthlyTotalExpenses / monthlySalary;
}

export function calculateSurplusOrShortfall(
  settings: FinanceSettings,
  monthlyTotalExpenses: number,
  projectionMonth: Pick<ProjectionMonth, 'isCurrentMonth'>,
): number {
  const availableIncome = projectionMonth.isCurrentMonth
    ? settings.monthlySalary + settings.currentMonthExtraBalance
    : settings.monthlySalary;

  return availableIncome - monthlyTotalExpenses;
}
