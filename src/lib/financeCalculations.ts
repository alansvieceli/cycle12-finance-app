import type {
  AccountItem,
  Category,
  FinanceSettings,
  MonthlyPaymentStatus,
  MonthlyValue,
  MonthNumber,
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

export type PaymentSummary = {
  totalPaid: number;
  totalPending: number;
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

/** @internal */
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

/** @internal */
export function calculateSalaryCommitmentPercentage(
  monthlyTotalExpenses: number,
  monthlySalary: number,
): number | null {
  if (monthlySalary <= 0) {
    return null;
  }

  return monthlyTotalExpenses / monthlySalary;
}

export function calculateAvailableIncome(
  settings: FinanceSettings,
  projectionMonth: Pick<ProjectionMonth, 'isCurrentMonth'>,
): number {
  return projectionMonth.isCurrentMonth
    ? settings.monthlySalary + settings.currentMonthExtraBalance
    : settings.monthlySalary;
}

export function calculateIncomeCommitmentPercentage(
  monthlyTotalExpenses: number,
  settings: FinanceSettings,
  projectionMonth: Pick<ProjectionMonth, 'isCurrentMonth'>,
): number | null {
  const availableIncome = calculateAvailableIncome(settings, projectionMonth);

  if (availableIncome <= 0) {
    return null;
  }

  return monthlyTotalExpenses / availableIncome;
}

export function calculateSurplusOrShortfall(
  settings: FinanceSettings,
  monthlyTotalExpenses: number,
  projectionMonth: Pick<ProjectionMonth, 'isCurrentMonth'>,
): number {
  const availableIncome = calculateAvailableIncome(settings, projectionMonth);

  return availableIncome - monthlyTotalExpenses;
}

export function calculateAccountBalance(
  availableIncome: number,
  totalPaid: number,
): number {
  return availableIncome - totalPaid;
}

export function calculatePaymentSummary(
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  paymentStatuses: MonthlyPaymentStatus[],
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): PaymentSummary {
  const summary: PaymentSummary = { totalPaid: 0, totalPending: 0 };

  for (const accountItem of accountItems) {
    const amount = getMonthlyValueAmount(
      monthlyValues,
      accountItem.id,
      projectionMonth,
    );

    if (isAccountItemPaid(paymentStatuses, accountItem.id, projectionMonth)) {
      summary.totalPaid += amount;
    } else {
      summary.totalPending += amount;
    }
  }

  return summary;
}

export function getMonthlyValueAmount(
  monthlyValues: MonthlyValue[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): number {
  return (
    monthlyValues.find(
      (monthlyValue) =>
        monthlyValue.accountItemId === accountItemId &&
        monthlyValue.month === projectionMonth.month &&
        monthlyValue.year === projectionMonth.year,
    )?.amount ?? 0
  );
}

export function isAccountItemPaid(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): boolean {
  return (
    paymentStatuses.find(
      (paymentStatus) =>
        paymentStatus.accountItemId === accountItemId &&
        paymentStatus.month === projectionMonth.month &&
        paymentStatus.year === projectionMonth.year,
    )?.isPaid ?? false
  );
}
