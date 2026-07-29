import { colors } from '../theme/colors';
import type { FinanceState } from '../types/finance';
import { getCategoryColor } from './categoryColors';
import { resolveCommitmentColor } from './commitmentColor';
import {
  type CategoryMonthTotal,
  calculateCategoryTotals,
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  calculateSurplusOrShortfall,
  type ProjectionMonth,
} from './financeCalculations';
import { formatMonthLabel } from './formatters';
import { sortCategories } from './sorting';

const MIN_BAR_RATIO = 0.02;

export type MonthlyChartPoint = {
  key: string;
  label: string;
  value: number;
};

export type CategoryChartPoint = {
  categoryId: string;
  color: string;
  label: string;
  value: number;
};

export type CommitmentChartPoint = {
  key: string;
  label: string;
  percentage: number | null;
  color: string;
};

export function calculateBalanceTotal(points: MonthlyChartPoint[]) {
  return points.reduce((total, point) => total + point.value, 0);
}

export function calculateNegativeBalanceTotal(points: MonthlyChartPoint[]) {
  return points.reduce((total, point) => total + Math.min(point.value, 0), 0);
}

/** Bar length of one balance, as a 0..1 fraction of the period's largest absolute value. */
export function calculateBalanceBarRatio(value: number, maxAbsoluteValue: number) {
  if (value === 0 || maxAbsoluteValue <= 0) {
    return 0;
  }

  return Math.max(Math.min(Math.abs(value) / maxAbsoluteValue, 1), MIN_BAR_RATIO);
}

/** @internal */
export function buildMonthlyExpenseChartData(
  financeState: FinanceState,
  projectionMonths: ProjectionMonth[],
): MonthlyChartPoint[] {
  const sortedCategories = sortCategories(financeState.categories);

  return projectionMonths.map((projectionMonth) => ({
    key: projectionMonth.key,
    label: formatShortMonthLabel(projectionMonth),
    value: calculateMonthlyTotalExpenses(
      sortedCategories,
      financeState.accountItems,
      financeState.monthlyValues,
      projectionMonth,
    ),
  }));
}

export function buildSurplusShortfallChartData(
  financeState: FinanceState,
  projectionMonths: ProjectionMonth[],
): MonthlyChartPoint[] {
  return buildMonthlyExpenseChartData(financeState, projectionMonths).map(
    (expensePoint) => {
      const projectionMonth = projectionMonths.find(
        (month) => month.key === expensePoint.key,
      );

      if (!projectionMonth) {
        return expensePoint;
      }

      return {
        ...expensePoint,
        value: calculateSurplusOrShortfall(
          financeState.settings,
          expensePoint.value,
          projectionMonth,
        ),
      };
    },
  );
}

export function buildCurrentMonthCategoryChartData(
  financeState: FinanceState,
  projectionMonth: ProjectionMonth,
): CategoryChartPoint[] {
  const sortedCategories = sortCategories(financeState.categories);
  const categoryNamesById = Object.fromEntries(
    sortedCategories.map((category) => [category.id, category.name]),
  );

  return calculateCategoryTotals(
    sortedCategories,
    financeState.accountItems,
    financeState.monthlyValues,
    projectionMonth,
  )
    .filter((categoryTotal) => categoryTotal.total > 0)
    .map((categoryTotal: CategoryMonthTotal) => ({
      categoryId: categoryTotal.categoryId,
      color: getCategoryColor(categoryTotal.categoryId, sortedCategories),
      label: categoryNamesById[categoryTotal.categoryId] ?? '-',
      value: categoryTotal.total,
    }));
}

export function buildMonthlyCommitmentChartData(
  financeState: FinanceState,
  projectionMonths: ProjectionMonth[],
): CommitmentChartPoint[] {
  const sortedCategories = sortCategories(financeState.categories);

  return projectionMonths.map((projectionMonth) => {
    const totalExpenses = calculateMonthlyTotalExpenses(
      sortedCategories,
      financeState.accountItems,
      financeState.monthlyValues,
      projectionMonth,
    );
    const percentage = calculateIncomeCommitmentPercentage(
      totalExpenses,
      financeState.settings,
      projectionMonth,
    );
    const color =
      resolveCommitmentColor(
        percentage,
        financeState.settings.commitmentWarningThreshold,
        financeState.settings.commitmentDangerThreshold,
      ) ?? colors.commitmentLow;

    return {
      key: projectionMonth.key,
      label: formatShortMonthLabel(projectionMonth),
      percentage,
      color,
    };
  });
}

function formatShortMonthLabel(projectionMonth: ProjectionMonth) {
  const monthLabel = formatMonthLabel(projectionMonth.year, projectionMonth.month);

  return monthLabel.split(' de ')[0].slice(0, 3);
}
