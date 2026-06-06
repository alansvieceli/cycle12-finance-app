import {
  calculateCategoryTotals,
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  calculateSurplusOrShortfall,
  CategoryMonthTotal,
  ProjectionMonth,
} from './financeCalculations';
import { formatMonthLabel } from './formatters';
import { getCategoryColor } from './categoryColors';
import { resolveCommitmentColor } from './commitmentColor';
import { sortCategories } from './sorting';
import { colors } from '../theme/colors';
import { FinanceState } from '../types/finance';

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
